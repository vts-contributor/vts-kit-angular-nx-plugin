import { Route } from '@angular/router';
import { DashboardComponent } from '@vts-kit-ng-nx-demo/layout/feature';

const ROUTES: Route[] = [
  {
    path: 'example',
    component: DashboardComponent,
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
