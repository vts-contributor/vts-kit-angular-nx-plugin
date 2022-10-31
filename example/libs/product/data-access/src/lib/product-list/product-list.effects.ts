import { Injectable } from '@angular/core';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { fetch } from '@nrwl/angular';
import { DbService } from '@vts-kit-ng-nx-demo/share/data-access';
import { catchError, EMPTY, map, of, switchMap, tap } from 'rxjs';
import {
  loadProductList,
  loadProductListFailure,
  loadProductListSuccess,
} from './product-list.actions';

@Injectable()
export class ProductListEffects {
  loadProducts = createEffect(() =>
    this.actions$.pipe(
      ofType(loadProductList),
      switchMap(() =>
        this.db.loadProduct$().pipe(
          map((products) => loadProductListSuccess({ products })),
          catchError(() => of(loadProductListFailure({ error: 'Unknown' })))
        )
      )
    )
  );

  constructor(private readonly actions$: Actions, private db: DbService) {}
}
