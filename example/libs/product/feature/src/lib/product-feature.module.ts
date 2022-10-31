import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import ROUTES from './routes';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import {
  PRODUCT_LIST_FEATURE_KEY,
  productListReducer,
} from '@vts-kit-ng-nx-demo/product/data-access';
import { ProductListEffects } from '@vts-kit-ng-nx-demo/product/data-access';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(ROUTES),
    StoreModule.forFeature(PRODUCT_LIST_FEATURE_KEY, productListReducer),
    EffectsModule.forFeature([ProductListEffects]),
  ],
})
export class ProductFeatureModule {}
