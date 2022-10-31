import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import * as selectors from './route.selectors';

@Injectable({ providedIn: 'root' })
export class RouteFacade {
  constructor(private store: Store) {}

  currentRoute$ = this.store.select(selectors.selectCurrentRoute);
  fragment$ = this.store.select(selectors.selectFragment);
  queryParams$ = this.store.select(selectors.selectQueryParams);
  queryParam$ = (param: string) =>
    this.store.select(selectors.selectQueryParam(param));
  routeParams$ = this.store.select(selectors.selectRouteParams);
  routeParam$ = (param: string) =>
    this.store.select(selectors.selectRouteParam(param));
  routeData$ = this.store.select(selectors.selectRouteData);
  url$ = this.store.select(selectors.selectUrl);
  title$ = this.store.select(selectors.selectTitle);
}
