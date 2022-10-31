import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductFacade } from '@vts-kit-ng-nx-demo/product/data-access';
import {
  ProductTableComponent,
  ProductStatisticComponent,
} from '@vts-kit-ng-nx-demo/product/ui';

@Component({
  selector: 'product-feature-list',
  standalone: true,
  imports: [CommonModule, ProductTableComponent, ProductStatisticComponent],
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent implements OnInit {
  loading$ = this.productFacade.loadingProducts$;
  products$ = this.productFacade.products$;

  loadingStat$ = this.productFacade.loadingStatistic$;
  statistic$ = this.productFacade.statistic$;

  constructor(private productFacade: ProductFacade) {}

  ngOnInit(): void {
    this.productFacade.loadProduct();
    this.productFacade.loadStatistic();
  }
}
