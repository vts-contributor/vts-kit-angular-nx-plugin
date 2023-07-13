import { Tree } from 'nx/src/generators/tree';
import { NormalizedSchema } from '../schema';
import { generateFiles } from '@nx/devkit';
import { join } from 'path';
import { strings } from '@angular-devkit/core';

export async function createStore(
  tree: Tree,
  schema: NormalizedSchema
) {
  const { projectSourceRoot, path, name, ...schematicOptions } = schema;

  generateFiles(
    tree,
    join(__dirname, '../files/'),
    join(projectSourceRoot, path),
    {
      tmpl: '',
      name,
      ...strings,
    }
  );
}
