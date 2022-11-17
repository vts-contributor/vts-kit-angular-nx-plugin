import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VtsChartModule } from '@ui-vts/ng-vts/chart';
import { VtsGridModule } from '@ui-vts/ng-vts/grid';
import { Observable } from 'rxjs';
import { ProductStatistic } from '@vts-kit-ng-nx-demo/share/data-access';

@Component({
  selector: 'product-ui-product-statistic',
  standalone: true,
  imports: [CommonModule, VtsChartModule, VtsGridModule],
  templateUrl: './product-statistic.component.html',
  styleUrls: ['./product-statistic.component.scss'],
})
export class ProductStatisticComponent implements OnInit {
  @Input() statistic$!: Observable<ProductStatistic | null>;
  @Input() loading$!: Observable<boolean>;

  constructor() {}

  ngOnInit(): void {}
}
