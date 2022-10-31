import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';
import ROUTES from './routes';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { VtsIconModule } from 'ng-vts/icon';
import { HttpClientModule } from '@angular/common/http';
import {
  ProductDetailEffects,
  productDetailReducer,
  ProductListEffects,
  productListReducer,
  ProductStatisticEffects,
  productStatisticReducer,
  PRODUCT_DETAIL_FEATURE_KEY,
  PRODUCT_LIST_FEATURE_KEY,
  PRODUCT_STATISTIC_FEATURE_KEY,
} from '@vts-kit-ng-nx-demo/product/data-access';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreRouterConnectingModule, routerReducer } from '@ngrx/router-store';

const rootReducers = {
  router: routerReducer,
  [PRODUCT_LIST_FEATURE_KEY]: productListReducer,
  [PRODUCT_STATISTIC_FEATURE_KEY]: productStatisticReducer,
  [PRODUCT_DETAIL_FEATURE_KEY]: productDetailReducer,
};

const rootEffects = [
  ProductListEffects,
  ProductStatisticEffects,
  ProductDetailEffects,
];

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    RouterModule.forRoot(ROUTES),
    BrowserAnimationsModule,
    VtsIconModule,
    HttpClientModule,
    StoreModule.forRoot(rootReducers),
    EffectsModule.forRoot(rootEffects),
    StoreRouterConnectingModule.forRoot(),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
