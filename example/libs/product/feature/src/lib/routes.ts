import { Route } from '@angular/router';

export const ROUTES: Route[] = [
  {
    path: '',
    // component: LayoutComponent,
    children: [
      {
        path: 'list',
        data: {
          title: 'Product List',
          breadcrumb: ['Product', 'List'],
        },
        loadComponent: () =>
          import('./list/list.component').then((c) => c.ListComponent),
      },
      {
        path: 'detail',
        data: {
          title: 'Product Detail',
          breadcrumb: ['Product', 'Detail'],
        },
        loadComponent: () =>
          import('./detail/detail.component').then((c) => c.DetailComponent),
      },
      { path: '**', redirectTo: '/example/list' },
    ],
  },
];

export default ROUTES;
