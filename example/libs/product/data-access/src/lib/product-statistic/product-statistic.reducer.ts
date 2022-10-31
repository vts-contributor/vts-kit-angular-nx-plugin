import { createReducer, on, Action } from '@ngrx/store';
import { ProductStatistic } from '@vts-kit-ng-nx-demo/share/data-access';

import * as ProductStatisticActions from './product-statistic.actions';

export const PRODUCT_STATISTIC_FEATURE_KEY = 'productStatistic';

export interface ProductStatisticState {
  loading: boolean;
  error?: string | null;
  data: ProductStatistic | null;
}

export const initialProductStatisticState: ProductStatisticState = {
  loading: false,
  error: null,
  data: null,
};

const reducer = createReducer(
  initialProductStatisticState,
  on(ProductStatisticActions.loadProductStatistic, (state) => ({
    ...state,
    loading: true,
  })),
  on(ProductStatisticActions.loadProductStatisticSuccess, (state, data) => ({
    ...state,
    data,
    loading: false,
  })),
  on(
    ProductStatisticActions.loadProductStatisticFailure,
    (state, { error }) => ({
      ...state,
      error,
      loading: false,
    })
  )
);

export function productStatisticReducer(
  state: ProductStatisticState | undefined,
  action: Action
) {
  return reducer(state, action);
}
