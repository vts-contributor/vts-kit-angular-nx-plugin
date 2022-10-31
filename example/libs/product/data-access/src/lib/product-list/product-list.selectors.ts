import { createFeatureSelector, createSelector } from '@ngrx/store';
import {
  PRODUCT_LIST_FEATURE_KEY,
  ProductListState,
  productListAdapter,
} from './product-list.reducer';

export const getProductListState = createFeatureSelector<ProductListState>(
  PRODUCT_LIST_FEATURE_KEY
);

const { selectAll, selectEntities } = productListAdapter.getSelectors();

export const getProductListLoading = createSelector(
  getProductListState,
  (state: ProductListState) => state.loading
);

export const getProductListError = createSelector(
  getProductListState,
  (state: ProductListState) => state.error
);

export const getAllProductList = createSelector(
  getProductListState,
  (state: ProductListState) => selectAll(state)
);

export const getProductListEntities = createSelector(
  getProductListState,
  (state: ProductListState) => selectEntities(state)
);

export const getSelectedId = createSelector(
  getProductListState,
  (state: ProductListState) => state.selectedId
);

export const getSelected = createSelector(
  getProductListEntities,
  getSelectedId,
  (entities, selectedId) => (selectedId ? entities[selectedId] : undefined)
);
