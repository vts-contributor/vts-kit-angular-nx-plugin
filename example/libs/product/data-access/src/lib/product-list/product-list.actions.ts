import { createAction, props } from '@ngrx/store';
import { Product } from '@vts-kit-ng-nx-demo/share/data-access';

export const loadProductList = createAction('[ProductList] Load ProductList');

export const loadProductListSuccess = createAction(
  '[ProductList] Load ProductList Success',
  props<{ products: Product[] }>()
);

export const loadProductListFailure = createAction(
  '[ProductList] Load ProductList Failure',
  props<{ error: any }>()
);
