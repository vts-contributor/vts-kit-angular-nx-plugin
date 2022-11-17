import { Route } from '@angular/router';

const ROUTES: Route[] = [
  {
    path: 'example',
    loadChildren: () =>
      import('@vts-kit-ng-nx-demo/product/feature').then(
        (c) => c.ProductFeatureModule
      ),
  },
  {
    path: 'welcome',
    loadChildren: () =>
      import('@vts-kit-ng-nx-demo/welcome/feature').then(
        (m) => m.WelcomeFeatureModule
      ),
  },
  { path: '**', redirectTo: '/welcome' },
];

export default ROUTES;
