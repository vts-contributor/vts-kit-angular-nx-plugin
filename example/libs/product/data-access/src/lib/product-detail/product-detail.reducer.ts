import { createReducer, on, Action } from '@ngrx/store';
import { ProductDetail } from '@vts-kit-ng-nx-demo/share/data-access';

import * as ProductDetailActions from './product-detail.actions';

export const PRODUCT_DETAIL_FEATURE_KEY = 'productDetail';

export interface ProductDetailState {
  loading: boolean;
  error?: string | null;
  data: ProductDetail | null;
}

export const initialProductDetailState: ProductDetailState = {
  loading: false,
  error: null,
  data: null,
};

const reducer = createReducer(
  initialProductDetailState,
  on(ProductDetailActions.loadProductDetail, (state) => ({
    ...state,
    loading: true,
  })),
  on(ProductDetailActions.loadProductDetailSuccess, (state, data) => ({
    ...state,
    data,
    loading: false,
  })),
  on(ProductDetailActions.loadProductDetailFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
  }))
);

export function productDetailReducer(
  state: ProductDetailState | undefined,
  action: Action
) {
  return reducer(state, action);
}
