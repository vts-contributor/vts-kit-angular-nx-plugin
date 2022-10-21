import { classify, dasherize } from '@angular-devkit/core/src/utils/strings';
import type { Tree } from '@nrwl/devkit';
import { tsquery } from '@phenomnomnominal/tsquery';
import { getFileInfo } from '../../utils/file-info';
import { getRelativeImportToFile } from '../../utils/path';
import { NormalizedSchema } from '../schema';

export function addRoute(
  tree: Tree,
  options: NormalizedSchema,
  routePath: string
): void {
  const routeContent = tree.read(routePath, 'utf-8');
  const ast = tsquery.ast(routeContent);
  const ROUTE_CHILD_SELECTOR =
    'VariableDeclaration:has(ArrayType > TypeReference > Identifier[name=Route]) PropertyAssignment:has(Identifier[name=children]) > ArrayLiteralExpression';
  const routeChildNode = tsquery(ast, ROUTE_CHILD_SELECTOR, {
    visitAllChildren: true,
  });
  const isRouteExist = routeChildNode.length > 0;
  if (!isRouteExist) {
    throw new Error(
      `Can't create route for file ${routePath}. Probably file structure has been changed.`
    );
  }

  const { filePath: componentPath } = getFileInfo(tree, {
    ...options,
    type: 'component',
  });
  const relativePath = getRelativeImportToFile(routePath, componentPath);
  const componentName = `${options.name.toLowerCase()}Component`;
  const dasherizeName = dasherize(options.name);
  const route = `{ path: '${dasherize(
    dasherizeName
  )}', loadComponent: () => import('${relativePath}').then(c => c.${classify(
    componentName
  )}) }`;

  const newContent = `${routeContent.slice(0, routeChildNode[0].getStart() + 1)}
    ${route},${routeContent.slice(routeChildNode[0].getStart() + 1, -1)}`;
  tree.write(routePath, newContent);
}
