import { Route } from '@angular/router';

const ROUTES: Route[] = [
  {
    path: '',
    children: [
      {
        path: '**',
        loadComponent: () =>
          import('./landing/landing.component').then((m) => m.LandingComponent),
      },
    ],
  },
];

export default ROUTES;
