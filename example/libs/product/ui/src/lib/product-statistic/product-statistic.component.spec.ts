import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductStatisticComponent } from './product-statistic.component';

describe('ProductStatisticComponent', () => {
  let component: ProductStatisticComponent;
  let fixture: ComponentFixture<ProductStatisticComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductStatisticComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductStatisticComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
