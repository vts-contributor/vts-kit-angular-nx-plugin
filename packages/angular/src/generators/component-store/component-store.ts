import type { GeneratorCallback, Tree } from '@nx/devkit';
import { formatFiles } from '@nx/devkit';
import { exportInEntryPoint } from '../utils/export';
import { normalizeOptions } from './lib/normalize-options';
import type { Schema } from './schema';
import { createStore } from './lib/create-store';
import { installPackage } from '../store/lib/install-store';

export async function componentStoreGenerator(tree: Tree, rawOptions: Schema) {
  const options = normalizeOptions(tree, rawOptions);

  let installTask: GeneratorCallback = () => { };
  installTask = installPackage(tree, options);

  await createStore(tree, options);
  exportInEntryPoint(tree, { ...options, type: 'store' });

  await formatFiles(tree);
  return installTask
}

export default componentStoreGenerator;
