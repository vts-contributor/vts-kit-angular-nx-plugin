import type { Tree } from '@nx/devkit';
import { formatFiles } from '@nx/devkit';
import { wrapAngularDevkitSchematic } from '@nx/devkit/ngcli-adapter';
import { exportInEntryPoint } from '../utils/export';
import { normalizeOptions } from './lib/normalize-options';
import type { Schema } from './schema';

export async function serviceGenerator(tree: Tree, rawOptions: Schema) {
  const options = normalizeOptions(tree, rawOptions);
  const { projectSourceRoot, ...schematicOptions } = options;

  const angularSchematic = wrapAngularDevkitSchematic(
    '@schematics/angular',
    'service'
  );
  await angularSchematic(tree, schematicOptions);
  exportInEntryPoint(tree, { ...options, type: 'service' });

  await formatFiles(tree);
}

export default serviceGenerator;
