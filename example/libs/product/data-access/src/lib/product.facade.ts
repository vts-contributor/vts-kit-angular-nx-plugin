import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { loadProductDetail } from './product-detail/product-detail.actions';
import {
  getProductDetail,
  getProductDetailLoading,
} from './product-detail/product-detail.selectors';
import { loadProductList } from './product-list/product-list.actions';
import {
  getAllProductList,
  getProductListLoading,
} from './product-list/product-list.selectors';
import { loadProductStatistic } from './product-statistic/product-statistic.actions';
import {
  getProductStatistic,
  getProductStatisticLoading,
} from './product-statistic/product-statistic.selectors';

@Injectable({ providedIn: 'root' })
export class ProductFacade {
  constructor(private store: Store) {}

  products$ = this.store.select(getAllProductList);
  loadingProducts$ = this.store.select(getProductListLoading);
  loadProduct = () => this.store.dispatch(loadProductList());

  statistic$ = this.store.select(getProductStatistic);
  loadingStatistic$ = this.store.select(getProductStatisticLoading);
  loadStatistic = () => this.store.dispatch(loadProductStatistic());

  detail$ = this.store.select(getProductDetail);
  loadingDetail$ = this.store.select(getProductDetailLoading);
  loadDetail = () => this.store.dispatch(loadProductDetail());
}
