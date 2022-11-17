import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '@vts-kit-ng-nx-demo/share/data-access';
import { Observable } from 'rxjs';
import { VtsTableModule } from '@ui-vts/ng-vts/table';

@Component({
  selector: 'product-ui-product-table',
  standalone: true,
  imports: [CommonModule, VtsTableModule],
  templateUrl: './product-table.component.html',
  styleUrls: ['./product-table.component.scss'],
})
export class ProductTableComponent implements OnInit {
  @Input() products$!: Observable<Product[]>;
  @Input() loading$!: Observable<boolean>;
  constructor() {}

  ngOnInit(): void {}
}
