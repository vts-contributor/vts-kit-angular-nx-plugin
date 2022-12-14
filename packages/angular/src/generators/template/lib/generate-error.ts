import { Tree } from 'nx/src/generators/tree';
import { getStyleType } from '../../utils/project';
import { Schema } from '../schema';
import featureGroupGenerator from '../../feature-group/feature-group';
import { generateFiles, readProjectConfiguration } from '@nrwl/devkit';
import { join } from 'path';
import { strings } from '@angular-devkit/core';

export async function generateErrorTemplate(tree: Tree, options: Schema) {
  const { name } = options;
  await featureGroupGenerator(tree, {
    name,
  });
  const style = getStyleType(tree);

  const featureProjectConfig = readProjectConfiguration(
    tree,
    `${name}-feature`
  );
  const { sourceRoot } = featureProjectConfig;

  generateFiles(
    tree,
    join(__dirname, '../files/error/feature'),
    join(sourceRoot, 'lib'),
    {
      tmpl: '',
      style,
      ...strings,
      ...options,
    }
  );
}
