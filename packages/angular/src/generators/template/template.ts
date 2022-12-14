import type { Tree } from '@nrwl/devkit';
import { formatFiles } from '@nrwl/devkit';
import { generateErrorTemplate } from './lib/generate-error';
import { normalizeOptions } from './lib/normalize-options';
import type { Schema } from './schema';

export async function templateGenerator(tree: Tree, rawOptions: Schema) {
  const options = normalizeOptions(tree, rawOptions);
  const { type } = options;
  switch (type) {
    case 'error':
      await generateErrorTemplate(tree, options);
      break;
  }
  await formatFiles(tree);
}

export default templateGenerator;
