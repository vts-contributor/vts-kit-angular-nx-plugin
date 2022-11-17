import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VtsMenuModule } from '@ui-vts/ng-vts/menu';
import { ROUTES as productRoutes } from '@vts-kit-ng-nx-demo/product/feature';
import { flatMap } from 'lodash-es';
import { Route, RouterModule } from '@angular/router';
import { RouteFacade } from '@vts-kit-ng-nx-demo/share/data-access';

export type RouteConfig = {
  title: string;
  icon: string;
  type: 'single' | 'group';
  children?: {
    title: string;
    route: string[];
  }[];
  route?: string[];
};

@Component({
  selector: 'layout-ui-sider',
  standalone: true,
  imports: [CommonModule, VtsMenuModule, RouterModule],
  templateUrl: './sider.component.html',
  styleUrls: ['./sider.component.scss'],
})
export class SiderComponent implements OnInit {
  routeData$ = this.routeFacade.routeData$;
  routes: RouteConfig[] = [];

  constructor(private routeFacade: RouteFacade) {
    this.routes = [
      ...this.mapToRouteConfig(productRoutes, '/example', 'Product', 'Window'),
    ];
  }

  mapToRouteConfig(
    routes: Route[],
    preRoute: string,
    title: string,
    icon: string
  ): RouteConfig[] {
    const items = (
      flatMap(productRoutes.map((item) => item.children)) as {
        path: string;
        data: { title: string };
      }[]
    )
      .filter((item) => item.path !== '**')
      .map((item) => ({
        path: item.path,
        data: item.data,
      }));

    if (items.length == 0) return [];
    else if (items.length == 1)
      return [
        {
          title,
          icon,
          type: 'single',
          route: [preRoute, items[0].path],
        },
      ];
    else
      return [
        {
          title,
          icon,
          type: 'group',
          children: items.map((item) => ({
            title: item.data.title,
            route: [preRoute, item.path],
          })),
        },
      ];
  }

  ngOnInit(): void {}
}
