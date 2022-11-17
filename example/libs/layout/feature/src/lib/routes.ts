import { Route } from '@angular/router';

const ROUTES: Route[] = [
  {
    path: '',
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./dashboard/dashboard.component').then(
            (c) => c.DashboardComponent
          ),
      },
      // Wildcard Route
      // { path: '**', redirectTo: '/' }
    ],
  },
];

export default ROUTES;
