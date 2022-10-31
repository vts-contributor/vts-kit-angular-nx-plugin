import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { createReducer, on, Action } from '@ngrx/store';
import { Product } from '@vts-kit-ng-nx-demo/share/data-access';

import * as ProductListActions from './product-list.actions';

export const PRODUCT_LIST_FEATURE_KEY = 'productList';

export interface ProductListState extends EntityState<Product> {
  selectedId?: string | number;
  loading: boolean;
  error?: string | null;
}

export const productListAdapter: EntityAdapter<Product> =
  createEntityAdapter<Product>();

export const initialProductListState: ProductListState =
  productListAdapter.getInitialState({
    loading: false,
    error: null,
  });

const reducer = createReducer(
  initialProductListState,
  on(ProductListActions.loadProductList, (state) => ({
    ...state,
    loading: true,
  })),
  on(ProductListActions.loadProductListSuccess, (state, { products }) =>
    productListAdapter.setAll(products, { ...state, loading: false })
  ),
  on(ProductListActions.loadProductListFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
  }))
);

export function productListReducer(
  state: ProductListState | undefined,
  action: Action
) {
  return reducer(state, action);
}
