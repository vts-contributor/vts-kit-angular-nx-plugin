import { Injectable } from '@angular/core';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { DbService } from '@vts-kit-ng-nx-demo/share/data-access';
import { catchError, map, of, switchMap } from 'rxjs';
import {
  loadProductDetail,
  loadProductDetailFailure,
  loadProductDetailSuccess,
} from './product-detail.actions';

@Injectable()
export class ProductDetailEffects {
  loadProducts = createEffect(() =>
    this.actions$.pipe(
      ofType(loadProductDetail),
      switchMap(() =>
        this.db.loadDetail$().pipe(
          map((data) => loadProductDetailSuccess(data)),
          catchError(() => of(loadProductDetailFailure({ error: 'Unknown' })))
        )
      )
    )
  );

  constructor(private readonly actions$: Actions, private db: DbService) {}
}
