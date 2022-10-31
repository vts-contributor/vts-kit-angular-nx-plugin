import { createFeatureSelector, createSelector } from '@ngrx/store';
import {
  ProductDetailState,
  PRODUCT_DETAIL_FEATURE_KEY,
} from './product-detail.reducer';

export const getProductDetailState = createFeatureSelector<ProductDetailState>(
  PRODUCT_DETAIL_FEATURE_KEY
);

export const getProductDetailLoading = createSelector(
  getProductDetailState,
  (state: ProductDetailState) => state.loading
);

export const getProductDetailError = createSelector(
  getProductDetailState,
  (state: ProductDetailState) => state.error
);

export const getProductDetail = createSelector(
  getProductDetailState,
  (state: ProductDetailState) => state.data
);
