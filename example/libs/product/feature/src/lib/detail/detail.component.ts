import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductDetailComponent } from '@vts-kit-ng-nx-demo/product/ui';
import { ProductFacade } from '@vts-kit-ng-nx-demo/product/data-access';

@Component({
  selector: 'product-feature-detail',
  standalone: true,
  imports: [CommonModule, ProductDetailComponent],
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss'],
})
export class DetailComponent implements OnInit {
  loading$ = this.productFacade.loadingDetail$;
  detail$ = this.productFacade.detail$;
  constructor(private productFacade: ProductFacade) {}

  ngOnInit(): void {
    this.productFacade.loadDetail();
  }
}
