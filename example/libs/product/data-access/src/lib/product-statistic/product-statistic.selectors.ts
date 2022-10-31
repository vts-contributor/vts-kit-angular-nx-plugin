import { createFeatureSelector, createSelector } from '@ngrx/store';
import {
  ProductStatisticState,
  PRODUCT_STATISTIC_FEATURE_KEY,
} from './product-statistic.reducer';

export const getProductStatisticState =
  createFeatureSelector<ProductStatisticState>(PRODUCT_STATISTIC_FEATURE_KEY);

export const getProductStatisticLoading = createSelector(
  getProductStatisticState,
  (state: ProductStatisticState) => state.loading
);

export const getProductStatisticError = createSelector(
  getProductStatisticState,
  (state: ProductStatisticState) => state.error
);

export const getProductStatistic = createSelector(
  getProductStatisticState,
  (state: ProductStatisticState) => state.data
);
