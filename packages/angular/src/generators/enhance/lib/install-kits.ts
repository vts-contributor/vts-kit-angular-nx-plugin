import { strings } from '@angular-devkit/core';
import {
  addDependenciesToPackageJson,
  generateFiles,
  ProjectConfiguration,
  readProjectConfiguration,
  readWorkspaceConfiguration,
  updateProjectConfiguration,
} from '@nrwl/devkit';
import { insertImport } from '@nrwl/workspace/src/utilities/ast-utils';
import { Tree } from 'nx/src/generators/tree';
import { join } from 'path';
import { createSourceFile, ScriptTarget } from 'typescript';
import { addImportToModule } from '../../utils/nx-devkit/ast-utils';
import { readDefaultProjectConfigurationFromTree } from '../../utils/project';
import {
  ngxTranslateVersion,
  webpackAnalyzerVersion,
} from '../../utils/versions';
import { Schema } from '../schema';

export function installKits(tree: Tree, options: Schema) {
  const task = installTask(tree, options);
  updateAngularJson(tree, options);
  addKitConfig(tree, options);
  updateAppModule(tree, options);
  return task;
}

function installTask(tree: Tree, options: Schema) {
  return addDependenciesToPackageJson(
    tree,
    {
      '@ui-vts/ng-vts': 'latest',
      '@vts-kit/angular-network': 'latest',
      '@vts-kit/angular-validator': 'latest',
      '@vts-kit/angular-common': 'latest',
      '@ngx-translate/core': ngxTranslateVersion,
    },
    {
      'cross-env': 'latest',
      'webpack-bundle-analyzer': webpackAnalyzerVersion,
    }
  );
}

async function updateAngularJson(tree: Tree, options: Schema) {
  const projectConfig = readDefaultProjectConfigurationFromTree(tree);
  const { name, sourceRoot } = projectConfig;

  const update: ProjectConfiguration = {
    ...projectConfig,
    targets: {
      ...projectConfig.targets,
      build: {
        ...projectConfig.targets['build'],
        options: {
          ...projectConfig.targets['build'].options,
          assets: [
            ...projectConfig.targets['build'].options.assets,
            {
              glob: '**/*',
              input: './node_modules/@ui-vts/icons-svg/svg/',
              output: '/assets/',
            },
          ],
          styles: [`${sourceRoot}/styles/global.${options.style}`],
        },
      },
    },
  };
  updateProjectConfiguration(tree, name, update);
}

async function addKitConfig(tree: Tree, options: Schema) {
  const project = readWorkspaceConfiguration(tree).defaultProject;
  const projectConfig = readProjectConfiguration(tree, project);
  const { sourceRoot } = projectConfig;
  tree.write(
    join(sourceRoot, 'app', 'configs.ts'),
    `
    import { TranslateLoader, TranslateModuleConfig } from "@ngx-translate/core"
    import { RestClientOptions, VtsRestModuleConfig } from "@vts-kit/angular-network"
    import { from, Observable } from "rxjs"
    
    /**
     * Network Module Config
     */
    export const NETWORK_MODULE_CONFIG: VtsRestModuleConfig = {
      defaultConfig: new RestClientOptions().setBaseUrl(
        'https://<base_api_url>'
      )
    }
    
    
    /**
     * Translate Module Config
     */
    class TranslateHttpLoader extends TranslateLoader {
      getTranslation(lang: string): Observable<any> {
        return from(fetch(\`./assets/locale/\${lang}.json\`).then(d => d.json()))
      }
    }
    
    export const TRANSLATE_MODULE_CONFIG: TranslateModuleConfig = ({
      defaultLanguage: 'vi',
      loader: {
        provide: TranslateLoader,
        useClass: TranslateHttpLoader
      }
    })`
  );
}

async function updateAppModule(tree: Tree, options: Schema) {
  const project = readWorkspaceConfiguration(tree).defaultProject;
  const projectConfig = readProjectConfiguration(tree, project);
  const { sourceRoot } = projectConfig;
  const modulePath = join(sourceRoot, 'app', 'app.module.ts');
  const sourceText = tree.read(modulePath, 'utf-8');

  let sourceFile = createSourceFile(
    modulePath,
    sourceText,
    ScriptTarget.Latest,
    true
  );

  /**
   * Network
   */
  sourceFile = insertImport(
    tree,
    sourceFile,
    modulePath,
    `VtsRestModule`,
    '@vts-kit/angular-network'
  );

  sourceFile = insertImport(
    tree,
    sourceFile,
    modulePath,
    `NETWORK_MODULE_CONFIG`,
    './configs'
  );

  sourceFile = addImportToModule(
    tree,
    sourceFile,
    modulePath,
    `VtsRestModule.forRoot(NETWORK_MODULE_CONFIG)`
  );

  /**
   * Translate
   */
  generateFiles(
    tree,
    join(__dirname, '../files/translate-assets'),
    join(sourceRoot, 'assets'),
    {
      tmpl: '',
      ...strings,
      ...options,
    }
  );

  sourceFile = insertImport(
    tree,
    sourceFile,
    modulePath,
    `TranslateModule`,
    '@ngx-translate/core'
  );

  sourceFile = insertImport(
    tree,
    sourceFile,
    modulePath,
    `TRANSLATE_MODULE_CONFIG`,
    './configs'
  );

  sourceFile = addImportToModule(
    tree,
    sourceFile,
    modulePath,
    `TranslateModule.forRoot(TRANSLATE_MODULE_CONFIG)`
  );
}
