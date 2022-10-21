import type { Tree } from '@nrwl/devkit';
import { joinPathFragments, normalizePath } from '@nrwl/devkit';
import { dirname } from 'path';
import type { NormalizedSchema } from '../schema';

const routeFile = 'routes.ts';

export function findRoute(
  tree: Tree,
  options: NormalizedSchema,
  projectRoot: string
): string | null {
  const pathToCheck = joinPathFragments(options.path);
  const routeFilePath = findRouteFile(tree, pathToCheck, projectRoot);
  if (routeFilePath) return normalizePath(routeFilePath);
  return null;
}

function findRouteFile(
  tree: Tree,
  generateDir: string,
  projectRoot: string
): string | null {
  let dir = generateDir;
  const projectRootParent = dirname(projectRoot);

  while (dir !== projectRootParent) {
    const allMatches = tree
      .children(dir)
      .map((path) => joinPathFragments(dir, path))
      .filter((path) => tree.isFile(path) && path.match(routeFile));

    if (allMatches.length == 1) {
      return allMatches[0];
    } else if (allMatches.length > 1) {
      return null;
    }

    dir = dirname(dir);
  }

  return null;
}
