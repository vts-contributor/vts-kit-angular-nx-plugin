import { Tree } from 'nx/src/generators/tree';
import { NormalizedSchema } from './normalized-schema';
import { joinPathFragments } from 'nx/src/utils/path';

export async function createRoutes(
  tree: Tree,
  { libraryOptions }: NormalizedSchema
) {
  const pathToRoutes = joinPathFragments(
    libraryOptions.projectRoot,
    'src/lib/routes.ts'
  );

  const routesContents = `import { Route } from '@angular/router';
  
      const ROUTES: Route[] = [{
        path: '',
        // component: LayoutComponent,
        children: [
          // Wildcard Route
          // { path: '**', redirectTo: '/' }
        ]
      }];
      
      export default ROUTES;
      `;
  tree.write(pathToRoutes, routesContents);

  const pathToEntryFile = joinPathFragments(
    libraryOptions.projectRoot,
    'src',
    `${libraryOptions.entryFile}.ts`
  );
  const entryFileContents = tree.read(pathToEntryFile, 'utf-8');
  tree.write(
    pathToEntryFile,
    `${entryFileContents}
      export * from './lib/routes'`
  );
}
