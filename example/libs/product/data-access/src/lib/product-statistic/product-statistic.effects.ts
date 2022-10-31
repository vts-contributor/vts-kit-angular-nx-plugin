import { Injectable } from '@angular/core';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { DbService } from '@vts-kit-ng-nx-demo/share/data-access';
import { catchError, map, of, switchMap } from 'rxjs';
import {
  loadProductStatistic,
  loadProductStatisticFailure,
  loadProductStatisticSuccess,
} from './product-statistic.actions';

@Injectable()
export class ProductStatisticEffects {
  loadProducts = createEffect(() =>
    this.actions$.pipe(
      ofType(loadProductStatistic),
      switchMap(() =>
        this.db.loadStatistic$().pipe(
          map((data) => loadProductStatisticSuccess(data)),
          catchError(() =>
            of(loadProductStatisticFailure({ error: 'Unknown' }))
          )
        )
      )
    )
  );

  constructor(private readonly actions$: Actions, private db: DbService) {}
}
