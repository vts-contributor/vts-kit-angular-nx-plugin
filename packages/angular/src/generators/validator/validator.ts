import { generateFiles, Tree } from '@nrwl/devkit';
import { formatFiles } from '@nrwl/devkit';
import { join } from 'path';
import { exportInEntryPoint } from '../utils/export';
import { normalizeOptions } from './lib/normalize-options';
import type { Schema } from './schema';
import { strings } from '@angular-devkit/core';

export async function validatorGenerator(tree: Tree, rawOptions: Schema) {
  const options = normalizeOptions(tree, rawOptions);
  const { path, flat, form, skipTests, name } = options;
  const dasherizeName = strings.dasherize(name);
  const genPath = flat ? path : join(path, dasherizeName);
  const genOptions = {
    tmpl: '',
    ...strings,
    ...options,
    name: dasherizeName,
  };

  generateFiles(
    tree,
    join(__dirname, './files/validator'),
    genPath,
    genOptions
  );
  if (!skipTests) {
    generateFiles(
      tree,
      join(__dirname, './files/validator-test'),
      genPath,
      genOptions
    );
  }
  exportInEntryPoint(tree, { ...options, type: 'validator' });

  if (form === 'template') {
    generateFiles(
      tree,
      join(__dirname, './files/directive'),
      genPath,
      genOptions
    );
    if (!skipTests) {
      generateFiles(
        tree,
        join(__dirname, './files/directive-test'),
        genPath,
        genOptions
      );
    }
    exportInEntryPoint(tree, { ...options, type: 'directive' });
  }

  await formatFiles(tree);
}

export default validatorGenerator;
