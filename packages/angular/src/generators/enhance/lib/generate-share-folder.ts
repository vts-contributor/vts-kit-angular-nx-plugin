import {
  readNxJson,
} from '@nx/devkit';
import { Tree } from '@nx/devkit';
import { NormalizedSchema } from '../schema';
import { libraryGenerator } from '../../library/library';
import { dasherize } from '@angular-devkit/core/src/utils/strings';
import { getNpmScope } from '@nx/js/src/utils/package-json/get-npm-scope';

const SHARE_PATH = 'share';

async function generateLib(tree: Tree, libName: string) {
  const npmScope = getNpmScope(tree);
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
  await generateLib(tree, 'directives');
  await generateLib(tree, 'interceptors');
  // await generateLib(tree, 'mixins');
  await generateLib(tree, 'services');
  await generateLib(tree, 'ui');
  await generateLib(tree, 'utils');
  await generateLib(tree, 'validators');
  await generateLib(tree, 'data-access');
}
