import type { GeneratorCallback, Tree } from '@nx/devkit';
import { formatFiles } from '@nx/devkit';
import { exportInEntryPoint } from '../utils/export';
import { normalizeOptions } from './lib/normalize-options';
import type { Schema } from './schema';
import { createStore } from './lib/create-store';
import { installPackage } from './lib/install-store';

export async function storeGenerator(tree: Tree, rawOptions: Schema) {
  const options = normalizeOptions(tree, rawOptions);

  let installTask: GeneratorCallback = () => { };
  installTask = installPackage(tree, options);

  await createStore(tree, options);
  exportInEntryPoint(tree, { ...options, type: 'action' });
  exportInEntryPoint(tree, { ...options, type: 'effect' });
  exportInEntryPoint(tree, { ...options, type: 'reducer' });
  exportInEntryPoint(tree, { ...options, type: 'selector' });

  await formatFiles(tree);
  return installTask
}

export default storeGenerator;
