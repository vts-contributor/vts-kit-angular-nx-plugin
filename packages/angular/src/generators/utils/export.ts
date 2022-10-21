import type { Tree } from '@nrwl/devkit';
import { logger, readProjectConfiguration, stripIndents } from '@nrwl/devkit';
import { locateLibraryEntryPointFromDirectory } from './entry-point';
import { GenerationOptions, getFileInfo } from './file-info';
import { getRelativeImportToFile } from './path';

export function exportInEntryPoint(
  tree: Tree,
  schema: GenerationOptions
): void {
  const { root, projectType } = readProjectConfiguration(tree, schema.project);

  if (projectType === 'application') {
    return;
  }

  const { directory, filePath } = getFileInfo(tree, schema);

  const entryPointPath = locateLibraryEntryPointFromDirectory(
    tree,
    directory,
    root,
    schema.projectSourceRoot
  );
  if (!entryPointPath) {
    logger.warn(
      `Unable to determine whether the item should be exported in the library entry point file. ` +
        `The library's entry point file could not be found. Skipping exporting the component in the entry point file.`
    );

    return;
  }

  const relativePathFromEntryPoint = getRelativeImportToFile(
    entryPointPath,
    filePath
  );
  const updateEntryPointContent = stripIndents`${tree.read(
    entryPointPath,
    'utf-8'
  )}
    export * from "${relativePathFromEntryPoint}";`;

  tree.write(entryPointPath, updateEntryPointContent);
}
