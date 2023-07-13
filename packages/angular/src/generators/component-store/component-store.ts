import type { Tree } from '@nx/devkit';
import { formatFiles } from '@nx/devkit';
import { exportInEntryPoint } from '../utils/export';
import { normalizeOptions } from './lib/normalize-options';
import type { Schema } from './schema';
import { createStore } from './lib/create-store';

export async function componentStoreGenerator(tree: Tree, rawOptions: Schema) {
  const options = normalizeOptions(tree, rawOptions);
  await createStore(tree, options);
  exportInEntryPoint(tree, { ...options, type: 'store' });

  await formatFiles(tree);
}

export default componentStoreGenerator;
