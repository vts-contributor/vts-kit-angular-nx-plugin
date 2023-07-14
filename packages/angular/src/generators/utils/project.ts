import {
  joinPathFragments,
  normalizePath,
  ProjectConfiguration,
  readProjectConfiguration,
  readNxJson,
  Tree,
} from '@nx/devkit';
import { join, relative } from 'path';
import { checkPathUnderFolder } from './path';

export function normalizeProjectAndPath(
  tree: Tree,
  options: { path?: string; project?: string }
) {
  const project =
    options.project ??
    readNxJson(tree).defaultProject;

  const { root, sourceRoot, projectType } = readProjectConfiguration(
    tree,
    project
  );
  const projectSourceRoot = sourceRoot ?? joinPathFragments(root, 'src');
  const defaultPath = joinPathFragments(
    projectSourceRoot,
    projectType === 'application' ? 'app' : 'lib'
  );

  let path = defaultPath;
  if (options.path) {
    let pathToComponent = normalizePath(options.path);
    pathToComponent = pathToComponent.startsWith('/')
      ? pathToComponent.slice(1)
      : pathToComponent;

    if (
      pathToComponent === root ||
      pathToComponent === projectSourceRoot ||
      pathToComponent === defaultPath
    )
      path = defaultPath;
    else path = checkPathUnderFolder(defaultPath, pathToComponent);

    if (!path)
      throw new Error(
        `The path provided (${pathToComponent}) does not exist under project source ${defaultPath}. ` +
        `Please make sure to provide a path that exists under the workspace root.`
      );
  }

  const isDefault = relative(path, defaultPath) === '';
  return { project, projectSourceRoot, path, isDefault };
}

export function readProjectConfigurationFromTree(
  tree: Tree,
  projectConfig: ProjectConfiguration
) {
  const { sourceRoot } = projectConfig;
  const config = JSON.parse(
    tree.read(join(sourceRoot, '..', 'project.json'), 'utf-8')
  ) as ProjectConfiguration;
  return {
    ...projectConfig,
    ...config,
  };
}

export function readDefaultProjectConfigurationFromTree(tree: Tree) {
  const project = readNxJson(tree).defaultProject;
  const projectConfig = readProjectConfiguration(tree, project);
  return readProjectConfigurationFromTree(tree, projectConfig);
}

export function getStyleType(tree: Tree) {
  const { generators } = readNxJson(tree);
  const packageName = require('../../../package.json').name;
  const generateName = `${packageName}:component`;
  if (generators[generateName] != null) {
    const { style } = generators[generateName];
    return style;
  }
  return 'scss';
}
