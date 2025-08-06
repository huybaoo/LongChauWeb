import { Component, OnInit, NgModule } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Order } from '../models/order.model'; // Import kiểu Order từ file khác
import { Router } from '@angular/router';
import { HeaderAdminComponent } from '../header-admin/header-admin.component';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.css'],
})
export class OrderListComponent implements OnInit {
  orders: Order[] = [];

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    // Kiểm tra xem quản trị viên đã đăng nhập chưa
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Bạn cần phải đăng nhập để truy cập trang này.');
      this.router.navigate(['/login-admin']); // Chuyển hướng đến trang đăng nhập quản trị viên
      return; // Dừng thực hiện nếu chưa đăng nhập
    }

    this.getOrders();
  }

  getOrders() {
    this.http.get<Order[]>('http://localhost:3000/api/orders').subscribe(
      data => {
        this.orders = data;
      },
      error => {
        console.error('Lỗi lấy đơn hàng:', error);
      }
    );
  }

  // Hàm để điều hướng đến chi tiết hóa đơn
  viewOrderDetails(orderId: string) {
    this.router.navigate(['/orders', orderId]); // Điều hướng đến trang chi tiết hóa đơn
  }

  // Hàm xác nhận đơn hàng
  confirmOrder(order: Order) {
    const confirm = window.confirm("Bạn có chắc chắn muốn xác nhận đơn hàng này?");
    if (confirm) {
      // Cập nhật trạng thái đơn hàng
      this.http.put(`http://localhost:3000/api/orders/${order._id}/confirm`, {}).subscribe(
        response => {
          // Cập nhật lại danh sách đơn hàng sau khi xác nhận
          this.getOrders();
        },
        error => {
          console.error('Lỗi xác nhận đơn hàng:', error);
        }
      );
    }
  }
}

// Tạo module tạm thời
@NgModule({
  imports: [
    CommonModule,
    HeaderAdminComponent
  ],
  declarations: [OrderListComponent],
  exports: [OrderListComponent]
})
export class OrderListModule {}