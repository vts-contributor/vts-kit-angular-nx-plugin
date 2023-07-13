import { Tree } from 'nx/src/generators/tree';
import { getStyleType } from '../../utils/project';
import { Schema } from '../schema';
import featureGroupGenerator from '../../feature-group/feature-group';
import { generateFiles, readProjectConfiguration } from '@nx/devkit';
import { join } from 'path';
import { strings } from '@angular-devkit/core';
import { dasherize } from '@angular-devkit/core/src/utils/strings';

export async function generateErrorTemplate(tree: Tree, options: Schema) {
  const { name: rawName } = options;
  const name = dasherize(rawName);
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
