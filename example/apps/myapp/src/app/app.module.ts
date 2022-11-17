import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';
import ROUTES from './routes';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
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
import { VtsRestModule } from '@vts-kit/angular-network';
import { TranslateModule } from '@ngx-translate/core';
import { NETWORK_MODULE_CONFIG, TRANSLATE_MODULE_CONFIG } from './configs';

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
    BrowserAnimationsModule,
    RouterModule.forRoot(ROUTES),
    VtsRestModule.forRoot(NETWORK_MODULE_CONFIG),
    TranslateModule.forRoot(TRANSLATE_MODULE_CONFIG),
    StoreModule.forRoot(rootReducers),
    EffectsModule.forRoot(rootEffects),
    StoreRouterConnectingModule.forRoot(),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
