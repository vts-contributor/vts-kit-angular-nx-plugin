import {
  addProjectConfiguration,
  generateFiles,
  getWorkspaceLayout,
  joinPathFragments,
  offsetFromRoot,
  readProjectConfiguration,
  removeProjectConfiguration,
  Tree,
  updateJson,
} from '@nx/devkit';
import { getRelativePathToRootTsConfig } from '@nx/js';
import { replaceAppNameWithPath } from '../../utils/cli-config-utils';
import * as path from 'path';
import { NormalizedSchema } from './normalized-schema';
import { updateNgPackage } from './update-ng-package';

export async function updateProject(
  host: Tree,
  options: NormalizedSchema['libraryOptions']
) {
  createFiles(host, options);
  updateProjectTsConfig(host, options);
  fixProjectWorkspaceConfig(host, options);
  updateNgPackage(host, options);
  updateFiles(host, options);
}

function updateFiles(host: Tree, options: NormalizedSchema['libraryOptions']) {
  const libRoot = `${options.projectRoot}/src/lib/`;
  const serviceSpecPath = path.join(libRoot, `${options.name}.service.spec.ts`);
  const componentSpecPath = path.join(
    libRoot,
    `${options.name}.component.spec.ts`
  );

  host.delete(path.join(libRoot, `${options.name}.service.ts`));

  if (host.exists(serviceSpecPath)) {
    host.delete(serviceSpecPath);
  }

  host.delete(path.join(libRoot, `${options.name}.component.ts`));

  if (host.exists(componentSpecPath)) {
    host.delete(path.join(libRoot, `${options.name}.component.spec.ts`));
  }

  if (!options.publishable && !options.buildable) {
    host.delete(path.join(options.projectRoot, 'ng-package.json'));
    host.delete(path.join(options.projectRoot, 'package.json'));
    host.delete(path.join(options.projectRoot, 'tsconfig.lib.prod.json'));
    host.delete(path.join(options.projectRoot, '.browserslistrc'));
  }

  host.delete(path.join(options.projectRoot, 'karma.conf.js'));
  host.delete(path.join(options.projectRoot, 'src/test.ts'));
  host.delete(path.join(options.projectRoot, 'tsconfig.spec.json'));
  host.delete(path.join(libRoot, `${options.name}.module.ts`));

  host.write(`${options.projectRoot}/src/index.ts`, ``);
  if (options.feature) {
    host.write(
      path.join(libRoot, `${options.fileName}.module.ts`),
      `
        import { NgModule } from '@angular/core';
        import { CommonModule } from '@angular/common';
        
        @NgModule({
          imports: [
            CommonModule
          ]
        })
        export class ${options.moduleName} { }
        `
    );
    host.write(
      `${options.projectRoot}/src/index.ts`,
      `
      export * from './lib/${options.fileName}.module';
      `
    );
  }
}

function createFiles(host: Tree, options: NormalizedSchema['libraryOptions']) {
  generateFiles(
    host,
    path.join(__dirname, '../files/lib'),
    options.projectRoot,
    {
      ...options,
      rootTsConfigPath: getRelativePathToRootTsConfig(
        host,
        options.projectRoot
      ),
      tpl: '',
    }
  );
}

function fixProjectWorkspaceConfig(
  host: Tree,
  options: NormalizedSchema['libraryOptions']
) {
  let project = readProjectConfiguration(host, options.name);
  project.tags = options.parsedTags;

  if (options.ngCliSchematicLibRoot !== options.projectRoot) {
    project = replaceAppNameWithPath(
      project,
      options.ngCliSchematicLibRoot,
      options.projectRoot
    );
    // project already has the right root, but the above function, makes it incorrect.
    // This corrects it.
    project.root = options.projectRoot;
  }

  if (!options.publishable && !options.buildable) {
    delete project.targets.build;
  } else {
    // Set the right builder for the type of library.
    // Ensure the outputs property comes after the builder for
    // better readability.
    const { executor, ...rest } = project.targets.build;
    project.targets.build = {
      executor: options.publishable
        ? '@nx/angular:package'
        : '@nx/angular:ng-packagr-lite',
      outputs: [
        joinPathFragments(
          'dist',
          getWorkspaceLayout(host).libsDir,
          options.projectDirectory
        ),
      ],
      ...rest,
    };
  }

  delete project.targets.test;

  /**
   * The "$schema" property on our configuration files is only added when the
   * project configuration is added and not when updating it. It's done this
   * way to avoid re-adding "$schema" when updating a project configuration
   * and that property was intentionally removed by the devs.
   *
   * Since the project gets created by the Angular application schematic,
   * the "$schema" property is not added, so we remove the project and add
   * it back to workaround that.
   */
  removeProjectConfiguration(host, options.name);
  addProjectConfiguration(host, options.name, project, true);
}

function updateProjectTsConfig(
  host: Tree,
  options: NormalizedSchema['libraryOptions']
) {
  if (!host.exists(`${options.projectRoot}/tsconfig.lib.json`)) {
    host.write(`${options.projectRoot}/tsconfig.lib.json`, '{}');
  }
  updateJson(host, `${options.projectRoot}/tsconfig.lib.json`, (json) => {
    if (options.unitTestRunner === 'jest') {
      json.exclude = ['src/test-setup.ts', '**/*.spec.ts'];
    } else if (options.unitTestRunner === 'none') {
      json.exclude = [];
    } else {
      json.exclude = json.exclude || [];
    }

    return {
      ...json,
      extends: `./tsconfig.json`,
      compilerOptions: {
        ...json.compilerOptions,
        outDir: `${offsetFromRoot(options.projectRoot)}dist/out-tsc`,
      },
    };
  });
}
