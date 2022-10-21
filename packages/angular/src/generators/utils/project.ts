import {
  joinPathFragments,
  normalizePath,
  readProjectConfiguration,
  readWorkspaceConfiguration,
  Tree,
} from '@nrwl/devkit';
import { getProjectNameFromDirPath } from 'nx/src/utils/project-graph-utils';
import { relative } from 'path';
import { checkPathUnderFolder } from './path';

export function getProjectFromPath(path: string) {
  try {
    return getProjectNameFromDirPath(path);
  } catch {
    return null;
  }
}

export function normalizeProjectAndPath(
  tree: Tree,
  options: { path?: string; project?: string }
) {
  const project =
    options.project ??
    getProjectFromPath(options.path) ??
    readWorkspaceConfiguration(tree).defaultProject;

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
