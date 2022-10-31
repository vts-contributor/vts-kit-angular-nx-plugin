import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VtsDescriptionsModule } from 'ng-vts/descriptions';
import { Observable } from 'rxjs';
import { ProductDetail } from '@vts-kit-ng-nx-demo/share/data-access';

@Component({
  selector: 'product-ui-product-detail',
  standalone: true,
  imports: [CommonModule, VtsDescriptionsModule],
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ProductDetailComponent implements OnInit {
  @Input() detail$!: Observable<ProductDetail | null>;
  @Input() loading$!: Observable<boolean>;
  constructor() {}

  ngOnInit(): void {}
}
