import { createAction, props } from '@ngrx/store';
import { ProductStatistic } from '@vts-kit-ng-nx-demo/share/data-access';

export const loadProductStatistic = createAction(
  '[ProductStatistic] Load ProductStatistic'
);

export const loadProductStatisticSuccess = createAction(
  '[ProductStatistic] Load ProductStatistic Success',
  props<ProductStatistic>()
);

export const loadProductStatisticFailure = createAction(
  '[ProductStatistic] Load ProductStatistic Failure',
  props<{ error: any }>()
);
