import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { OrderComponent } from './order.component';

describe('OrderComponent', () => {
  let component: OrderComponent;
  let fixture: ComponentFixture<OrderComponent>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      declarations: [ OrderComponent ],
      imports: [ ReactiveFormsModule ],
      providers: [
        { provide: Router, useValue: routerSpy }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrderComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display error message if form is invalid', () => {
    component.onSubmit();
    expect(component.message).toBe('Vui lòng điền đầy đủ thông tin.');
  });

  it('should process payment and navigate on success', () => {
    component.orderForm.setValue({
      fullName: 'Nguyen Van A',
      phoneNumber: '0987654321',
      username: 'nguyenvana',
      password: '123456'
    });

    spyOn(Math, 'random').and.returnValue(0.6); // Giả lập thanh toán thành công

    component.onSubmit();

    expect(component.paymentSuccess).toBeTrue();
    expect(component.message).toBe('Thanh toán thành công!');
    expect(router.navigate).toHaveBeenCalledWith(['/success']);
  });

  it('should display error message on payment failure', () => {
    component.orderForm.setValue({
      fullName: 'Nguyen Van A',
      phoneNumber: '0987654321',
      username: 'nguyenvana',
      password: '123456'
    });

    spyOn(Math, 'random').and.returnValue(0.4); // Giả lập thanh toán thất bại

    component.onSubmit();

    expect(component.paymentSuccess).toBeFalse();
    expect(component.message).toBe('Thanh toán thất bại. Vui lòng thử lại.');
  });

  // Thêm test case cho hàm goBackToCart
  it('should navigate back to cart on goBackToCart', () => {
    component.goBackToCart();
    expect(router.navigate).toHaveBeenCalledWith(['/cart']);
  });
});
