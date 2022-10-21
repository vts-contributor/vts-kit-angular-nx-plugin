import type { Tree } from '@nrwl/devkit';
import { formatFiles } from '@nrwl/devkit';
import { generateLayout } from './lib/generate-layout';
import { generateShareFolder } from './lib/generate-share-folder';
import { normalizeOptions } from './lib/normalize-options';
import { overwriteWelcome } from './lib/overwrite-welcome';
import { updateWebpack } from './lib/update-webpack';
import { updateWorkspaceConfig } from './lib/update-workspace-config';
import type { Schema } from './schema';

export async function enhanceGenerator(tree: Tree, rawOptions: Schema) {
  const options = normalizeOptions(tree, rawOptions);
  try {
    await updateWorkspaceConfig(tree, options);
    await updateWebpack(tree, options);
    await generateLayout(tree, options);
    await generateShareFolder(tree, options);
    await overwriteWelcome(tree, options);
    await formatFiles(tree);
  } catch (e) {
    console.error(e);
    throw e;
  }
}

export default enhanceGenerator;
