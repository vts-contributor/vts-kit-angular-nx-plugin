import { strings } from '@angular-devkit/core';
import {
  generateFiles,
  readProjectConfiguration,
  readWorkspaceConfiguration,
} from '@nrwl/devkit';
import { Tree } from 'nx/src/generators/tree';
import { join } from 'path';
import { NormalizedSchema } from '../schema';
import featureGroupGenerator from '../../feature-group/feature-group';
import { readdirSync, readFileSync } from 'fs';

export async function overwriteWelcome(tree: Tree, options: NormalizedSchema) {
  await generateWelcome(tree, options);
  await overwriteApp(tree, options);
  await overwriteFavicon(tree, options);
}

async function overwriteApp(tree: Tree, options: NormalizedSchema) {
  const { defaultProject: project, npmScope } =
    readWorkspaceConfiguration(tree);
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
  const { npmScope } = readWorkspaceConfiguration(tree);

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

async function overwriteFavicon(tree: Tree, options: NormalizedSchema) {
  const { defaultProject: project } = readWorkspaceConfiguration(tree);
  const projectConfig = readProjectConfiguration(tree, project);
  const { sourceRoot } = projectConfig;

  const appRootFolder = join(__dirname, '../files/app-root');
  const appRootFiles = readdirSync(appRootFolder);
  appRootFiles.forEach((name) => {
    const replaceName = name.replace('__tmpl__', '');
    const replacePath = join(sourceRoot, replaceName);
    const sourcePath = join(appRootFolder, name);
    tree.write(replacePath, readFileSync(sourcePath));
  });
  // tree.write()
  // generateFiles(tree, join(__dirname, '../files/app-root'), sourceRoot, {
  //   tmpl: ''
  // })
}
