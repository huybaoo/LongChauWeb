import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OrdersUserComponent } from './orders-user.component';
import { UserOrderService } from '../services/user-order.service';
import { of } from 'rxjs';

class MockUserOrderService {
  getOrdersByUserId() {
    return of([
      { order_date: new Date(), total_amount: 239000, status: 'completed', _id: '1', fullName: 'Nguyễn Văn A' },
      { order_date: new Date(), total_amount: 150000, status: 'pending', _id: '2', fullName: 'Nguyễn Văn B' }
    ]);
  }
}

describe('OrdersUserComponent', () => {
  let component: OrdersUserComponent;
  let fixture: ComponentFixture<OrdersUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrdersUserComponent ],
      providers: [{ provide: UserOrderService, useClass: MockUserOrderService }]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrdersUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load orders on init', () => {
    expect(component.orders.length).toBeGreaterThan(0);
  });
});
