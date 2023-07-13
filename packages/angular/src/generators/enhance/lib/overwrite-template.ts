import { strings } from '@angular-devkit/core';
import {
  generateFiles,
  ProjectConfiguration,
  readProjectConfiguration,
  readNxJson,
  updateProjectConfiguration,
} from '@nx/devkit';
import { Tree } from 'nx/src/generators/tree';
import { join } from 'path';
import { NormalizedSchema } from '../schema';
import featureGroupGenerator from '../../feature-group/feature-group';
import { readDefaultProjectConfigurationFromTree } from '../../utils/project';

export async function overwriteTemplate(tree: Tree, options: NormalizedSchema) {
  await generateWelcome(tree, options);
  await overwriteApp(tree, options);
  await overwriteAppRoot(tree, options);
  await overwriteWorkspaceRoot(tree, options);
  await updateAppProjectConfig(tree, options);
}

async function overwriteApp(tree: Tree, options: NormalizedSchema) {
  const { defaultProject: project, npmScope } =
    readNxJson(tree);
  const projectConfig = readProjectConfiguration(tree, project);
  const { name, sourceRoot } = projectConfig;
  const appPath = `${sourceRoot}/app`;

  const appFiles = tree.children(appPath);
  appFiles.forEach((path) => tree.delete(`${appPath}/${path}`));

  generateFiles(tree, join(__dirname, '../files/app'), appPath, {
    tmpl: '',
    ...strings,
    ...options,
    name,
    npmScope,
  });
}

async function generateWelcome(tree: Tree, options: NormalizedSchema) {
  const { npmScope } = readNxJson(tree);

  await featureGroupGenerator(tree, {
    name: 'welcome',
  });

  const { sourceRoot: UISourceRoot } = readProjectConfiguration(
    tree,
    'welcome-ui'
  );
  generateFiles(tree, join(__dirname, '../files/welcome-ui'), UISourceRoot, {
    tmpl: '',
    ...strings,
    ...options,
  });

  const { sourceRoot: featureSourceRoot } = readProjectConfiguration(
    tree,
    'welcome-feature'
  );
  generateFiles(
    tree,
    join(__dirname, '../files/welcome-feature'),
    featureSourceRoot,
    {
      tmpl: '',
      ...strings,
      ...options,
      npmScope,
    }
  );
}

async function overwriteAppRoot(tree: Tree, options: NormalizedSchema) {
  const { defaultProject: project } = readNxJson(tree);
  const projectConfig = readProjectConfiguration(tree, project);
  const { sourceRoot } = projectConfig;
  tree.delete(`${sourceRoot}/styles.${options.style}`);

  const templateRootFolder = join(__dirname, '../files/app-root');
  generateFiles(tree, templateRootFolder, sourceRoot, {
    tmpl: '',
    ...strings,
    ...options,
  });
}

async function overwriteWorkspaceRoot(tree: Tree, options: NormalizedSchema) {
  generateFiles(tree, join(__dirname, '../files/workspace-root'), '/', {
    tmpl: '',
    ...strings,
    ...options,
  });
}

async function updateAppProjectConfig(tree: Tree, options: NormalizedSchema) {
  const projectConfig = readDefaultProjectConfigurationFromTree(tree);
  const { name } = projectConfig;

  const update: ProjectConfiguration = {
    ...projectConfig,
    targets: {
      ...projectConfig.targets,
      build: {
        ...projectConfig.targets['build'],
        configurations: {
          ...projectConfig.targets['build'].configurations,
          production: {
            ...projectConfig.targets['build'].configurations.production,
            budgets: [],
          },
        },
        options: {
          baseHref: '/',
          stylePreprocessorOptions: {
            includePaths: ['./node_modules'],
          },
          ...projectConfig.targets['build'].options,
        },
      },
    },
  };
  updateProjectConfiguration(tree, name, update);
}
