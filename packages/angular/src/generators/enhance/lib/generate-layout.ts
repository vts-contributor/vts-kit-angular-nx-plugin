import { Tree } from 'nx/src/generators/tree';
import featureGroupGenerator from '../../feature-group/feature-group';
import { Schema } from '../schema';

export async function generateLayout(tree: Tree, options: Schema) {
  await featureGroupGenerator(tree, {
    name: 'layout',
  });
}
