import { strings } from '@angular-devkit/core';
import { generateFiles } from '@nrwl/devkit';
import { Tree } from 'nx/src/generators/tree';
import { join } from 'path';
import { readDefaultProjectConfigurationFromTree } from '../../utils/project';
import { NormalizedSchema } from '../schema';

export async function updateCICD(tree: Tree, options: NormalizedSchema) {
  const projectConfig = readDefaultProjectConfigurationFromTree(tree);
  const { name } = projectConfig;
  generateFiles(tree, join(__dirname, '../files/cicd'), join('cicd'), {
    tmpl: '',
    ...strings,
    ...options,
    name,
  });
}
