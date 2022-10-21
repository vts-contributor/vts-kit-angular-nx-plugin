import type { Tree } from '@nrwl/devkit';
import { formatFiles } from '@nrwl/devkit';
import { wrapAngularDevkitSchematic } from '@nrwl/devkit/ngcli-adapter';
import { exportInEntryPoint } from '../utils/export';
import { normalizeOptions } from './lib/normalize-options';
import type { Schema } from './schema';

export async function enumGenerator(tree: Tree, rawOptions: Schema) {
  const options = normalizeOptions(tree, rawOptions);
  const { projectSourceRoot, ...schematicOptions } = options;

  const angularSchematic = wrapAngularDevkitSchematic(
    '@schematics/angular',
    'enum'
  );
  await angularSchematic(tree, schematicOptions);
  exportInEntryPoint(tree, { ...options, flat: true });

  await formatFiles(tree);
}

export default enumGenerator;
