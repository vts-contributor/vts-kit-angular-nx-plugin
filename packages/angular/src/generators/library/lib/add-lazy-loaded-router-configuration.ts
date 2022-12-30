import {
  joinPathFragments,
  readWorkspaceConfiguration,
  Tree,
} from '@nrwl/devkit';
import { insertImport } from '@nrwl/workspace/src/utilities/ast-utils';
import * as ts from 'typescript';
import { addImportToModule } from '../../utils/nx-devkit/ast-utils';
import { NormalizedSchema } from './normalized-schema';
import { tsquery } from '@phenomnomnominal/tsquery';
import { classify, dasherize } from '@angular-devkit/core/src/utils/strings';

export function addLazyLoadedRouterConfiguration(
  host: Tree,
  options: NormalizedSchema['libraryOptions']
) {
  addRouteToLocalModule(host, options);

  if (options.appRoutingPath) addRouteToAppModule(host, options);
}

function addRouteToLocalModule(
  host: Tree,
  options: NormalizedSchema['libraryOptions']
) {
  const moduleSource = host.read(options.modulePath)!.toString('utf-8');
  let sourceFile = ts.createSourceFile(
    options.modulePath,
    moduleSource,
    ts.ScriptTarget.Latest,
    true
  );

  sourceFile = addImportToModule(
    host,
    sourceFile,
    options.modulePath,
    `RouterModule.forChild(ROUTES)`
  );

  sourceFile = insertImport(
    host,
    sourceFile,
    options.modulePath,
    'RouterModule',
    '@angular/router'
  );

  sourceFile = insertImport(
    host,
    sourceFile,
    options.modulePath,
    'ROUTES',
    './routes',
    true
  );
}

function addRouteToAppModule(
  host: Tree,
  options: NormalizedSchema['libraryOptions']
) {
  const { appRoutingPath } = options;
  const routeFile = joinPathFragments(appRoutingPath, 'routes.ts');

  const existFile = findRouteFile(host, appRoutingPath, routeFile);
  if (!existFile) {
    const routeContent = `
    import { Route } from '@angular/router';

    export const ROUTES: Route[] = [];

    export default ROUTES;
    `;
    host.write(routeFile, routeContent);
    addRoute(host, options, routeFile);
  } else {
    addRoute(host, options, existFile);
  }
}

function findRouteFile(
  host: Tree,
  routePath: string,
  routeFile: string
): string | null {
  const allMatches = host
    .children(routePath)
    .map((path) => joinPathFragments(routePath, path))
    .filter((path) => host.isFile(path) && path.match(routeFile));

  if (allMatches.length == 1) {
    return allMatches[0];
  } else if (allMatches.length > 1) {
    return null;
  }
}

function addRoute(
  host: Tree,
  options: NormalizedSchema['libraryOptions'],
  routePath: string
): void {
  const routeContent = host.read(routePath, 'utf-8');
  const ast = tsquery.ast(routeContent);
  const ROUTE_CHILD_SELECTOR =
    'VariableDeclaration:has(ArrayType > TypeReference > Identifier[name=Route]) > ArrayLiteralExpression';
  const routeChildNode = tsquery(ast, ROUTE_CHILD_SELECTOR, {
    visitAllChildren: true,
  });
  const isRouteExist = routeChildNode.length > 0;
  if (!isRouteExist) {
    throw new Error(
      `Can't create route for file ${routePath}. Probably file structure has been changed.`
    );
  }

  const { importPath, moduleName, name } = options;

  const route = `{ path: '${dasherize(
    name.replace('-feature', '')
  )}', loadChildren: () => import('${importPath}').then(c => c.${moduleName}) }`;

  const newContent = `${routeContent.slice(0, routeChildNode[0].getStart() + 1)}
    ${route},${routeContent.slice(routeChildNode[0].getStart() + 1, -1)}`;
  host.write(routePath, newContent);
}
