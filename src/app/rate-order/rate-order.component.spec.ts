import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RateOrderComponent } from './rate-order.component';

describe('RateOrderComponent', () => {
  let component: RateOrderComponent;
  let fixture: ComponentFixture<RateOrderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RateOrderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RateOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
