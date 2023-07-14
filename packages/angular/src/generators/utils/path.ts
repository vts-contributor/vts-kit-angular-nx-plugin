import { joinPathFragments, workspaceRoot } from '@nx/devkit';
import { existsSync } from 'fs';
import { basename, dirname, join, normalize, relative } from 'path';

export function pathStartsWith(path1: string, path2: string) {
  path1 = normalize(path1).replace(/\\/g, '/');
  path2 = normalize(path2).replace(/\\/g, '/');

  return path1.startsWith(path2);
}

export function pathExist(path: string) {
  const pathToCheck = join(workspaceRoot, path);
  return existsSync(pathToCheck);
}

export function getRelativeImportToFile(
  sourceFilePath: string,
  targetFilePath: string
): string {
  const relativeDirToTarget = relative(
    dirname(sourceFilePath),
    dirname(targetFilePath)
  );

  return `./${joinPathFragments(
    relativeDirToTarget,
    basename(targetFilePath, '.ts')
  )}`;
}

export function checkPathUnderFolder(
  folder: string,
  path: string
): string | null {
  // Path is relative to workspace
  if (pathStartsWith(path, folder)) {
    return path;
  }

  // Path is relative to project
  const joinPath = joinPathFragments(folder, path);
  return pathExist(joinPath) ? joinPath : null;
}
