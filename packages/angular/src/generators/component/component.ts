import type { Tree } from '@nx/devkit';
import { formatFiles } from '@nx/devkit';
import { wrapAngularDevkitSchematic } from '@nx/devkit/ngcli-adapter';
import { exportInEntryPoint } from '../utils/export';
import { addRoute } from './lib/add-route';
import { findRoute } from './lib/find-route';
import { normalizeOptions } from './lib/normalize-options';
import type { Schema } from './schema';

export async function componentGenerator(tree: Tree, rawOptions: Schema) {
  const options = normalizeOptions(tree, rawOptions);
  const { projectSourceRoot, ...schematicOptions } = options;

  const angularComponentSchematic = wrapAngularDevkitSchematic(
    '@schematics/angular',
    'component'
  );
  await angularComponentSchematic(tree, schematicOptions);

  exportInEntryPoint(tree, { ...options, type: 'component' });

  const routeFilePath = findRoute(tree, options, options.projectSourceRoot);
  if (routeFilePath) {
    addRoute(tree, options, routeFilePath);
  }

  await formatFiles(tree);
}

export default componentGenerator;
