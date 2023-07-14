import { Tree } from '@nx/devkit';
import { NormalizedSchema } from '../schema';
import { generateFiles } from '@nx/devkit';
import { join } from 'path';
import { strings } from '@angular-devkit/core';

export async function createStore(
  tree: Tree,
  schema: NormalizedSchema
) {
  const { projectSourceRoot, path, name, flat, ...schematicOptions } = schema;
  generateFiles(
    tree,
    join(__dirname, '../files/store/'),
    flat ? path : join(path, name),
    {
      tmpl: '',
      name,
      ...strings,
      uppercase: (str) => str?.toUpperCase()
    }
  );
}
