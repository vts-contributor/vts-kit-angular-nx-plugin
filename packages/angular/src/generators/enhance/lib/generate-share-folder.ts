import {
  readProjectConfiguration,
  readWorkspaceConfiguration,
} from '@nrwl/devkit';
import { Tree } from 'nx/src/generators/tree';
import { NormalizedSchema } from '../schema';
import { libraryGenerator } from '../../library/library';
import { dasherize } from '@angular-devkit/core/src/utils/strings';

const SHARE_PATH = 'share';

async function generateLib(tree: Tree, libName: string) {
  const { npmScope } = readWorkspaceConfiguration(tree);
  const declareName = dasherize(libName);
  const importPath = `@${npmScope}/${SHARE_PATH}/${declareName}`;
  await libraryGenerator(tree, {
    name: declareName,
    directory: SHARE_PATH,
    publishable: true,
    importPath: importPath,
  });
}

export async function generateShareFolder(
  tree: Tree,
  options: NormalizedSchema
) {
  await generateLib(tree, 'pipes');
  await generateLib(tree, 'guards');
  await generateLib(tree, 'interceptors');
  // await generateLib(tree, 'mixins');
  await generateLib(tree, 'services');
  await generateLib(tree, 'ui');
  await generateLib(tree, 'utils');
  await generateLib(tree, 'validators');
}
