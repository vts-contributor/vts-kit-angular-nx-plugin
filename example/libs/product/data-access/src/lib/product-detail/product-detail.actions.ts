import { createAction, props } from '@ngrx/store';
import { ProductDetail } from '@vts-kit-ng-nx-demo/share/data-access';

export const loadProductDetail = createAction(
  '[ProductDetail] Load ProductDetail'
);

export const loadProductDetailSuccess = createAction(
  '[ProductDetail] Load ProductDetail Success',
  props<ProductDetail>()
);

export const loadProductDetailFailure = createAction(
  '[ProductDetail] Load ProductDetail Failure',
  props<{ error: any }>()
);
