import { Route } from '@angular/router';

export const ROUTES: Route[] = [
  {
    path: '',
    children: [
      {
        path: 'unknown',
        loadComponent: () =>
          import('./something-wrong/something-wrong.component').then(
            (c) => c.SomethingWrongComponent
          ),
      },
      {
        path: 'unauthorized',
        loadComponent: () =>
          import('./unauthorized/unauthorized.component').then(
            (c) => c.UnauthorizedComponent
          ),
      },
      {
        path: '500',
        loadComponent: () =>
          import(
            './internal-server-error/internal-server-error.component'
          ).then((c) => c.InternalServerErrorComponent),
      },
      {
        path: '404',
        loadComponent: () =>
          import('./not-found/not-found.component').then(
            (c) => c.NotFoundComponent
          ),
      },
    ],
  },
];

export default ROUTES;
