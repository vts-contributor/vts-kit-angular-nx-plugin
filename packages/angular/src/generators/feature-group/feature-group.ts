import { formatFiles, Tree } from '@nx/devkit';
import { normalizeOptions } from './lib/normalize-options';
import type { Schema } from './schema';
import { libraryGenerator } from '../library/library';

export async function featureGroupGenerator(tree: Tree, rawOptions: Schema) {
  const options = normalizeOptions(tree, rawOptions);
  const { groupPath, uiName, dataAccessName, featureName, appRoutingProject } =
    options;
  await libraryGenerator(tree, { name: uiName, directory: groupPath });
  await libraryGenerator(tree, { name: dataAccessName, directory: groupPath });
  await libraryGenerator(tree, {
    name: featureName,
    directory: groupPath,
    feature: !options.skipRoute,
    appRoutingProject,
  });
  await formatFiles(tree);
}

export default featureGroupGenerator;
