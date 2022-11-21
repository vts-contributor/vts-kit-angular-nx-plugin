import { Tree } from 'nx/src/generators/tree';
import { Schema } from '../schema';
import { tsquery } from '@phenomnomnominal/tsquery';
import {
  readProjectConfiguration,
  readWorkspaceConfiguration,
} from '@nrwl/devkit';
import { join } from 'path';

export async function updateAppConstructor(tree: Tree, options: Schema) {
  const project = readWorkspaceConfiguration(tree).defaultProject;
  const projectConfig = readProjectConfiguration(tree, project);
  const { sourceRoot } = projectConfig;
  const modulePath = join(sourceRoot, 'app', 'app.module.ts');
  const content = tree.read(modulePath, 'utf-8');
  const ast = tsquery.ast(content);
  const APP_MODULE_CONSTRUCTOR =
    'ClassDeclaration > Identifier[name=AppModule]';
  const nodes = tsquery(ast, APP_MODULE_CONSTRUCTOR, {
    visitAllChildren: true,
  });

  const newContent = `${content.slice(0, nodes[0].getEnd() + 1)} {}`;
  tree.write(modulePath, newContent);
}
