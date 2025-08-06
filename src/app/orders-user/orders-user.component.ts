import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Order } from '../models/order.model';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../header/header.component';
import { CancelOrderResponse } from '../models/order.model'; // Đảm bảo bạn đã tạo interface này

@Component({
  selector: 'app-orders-user',
  templateUrl: './orders-user.component.html',
  standalone: true,
  imports: [CommonModule, HeaderComponent],
  styleUrls: ['./orders-user.component.css'],
})
export class OrdersUserComponent implements OnInit {
  orders: Order[] = [];

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    // Kiểm tra xem người dùng đã đăng nhập hay chưa
    const userId = localStorage.getItem('userId');
    if (!userId) {
      // Nếu chưa đăng nhập, chuyển hướng đến trang đăng nhập
      this.router.navigate(['/login']);
    } else {
      // Nếu đã đăng nhập, tải đơn hàng của người dùng
      this.loadUserOrders(userId);
    }
  }

  loadUserOrders(userId: string): void {
    this.http.get<Order[]>(`http://localhost:3000/api/user-orders?userId=${userId}`).subscribe(
      (data) => {
        this.orders = data;
      },
      (error) => {
        console.error('Lỗi khi lấy đơn hàng', error);
      }
    );
  }

  viewOrderDetails(orderId: string): void {
    this.router.navigate(['/orders', orderId]); // Điều hướng đến trang chi tiết hóa đơn
  }

  rateOrder(orderId: string, productId: string): void {
    this.router.navigate(['/rate-order', { orderId, productId }]);
  }

  cancelOrder(orderId: string): void {
    console.log('Hủy đơn hàng với ID:', orderId); // In ra ID đơn hàng
    if (confirm('Bạn có chắc chắn muốn hủy đơn hàng này?')) {
        this.http.patch<CancelOrderResponse>(`http://localhost:3000/api/orders/${orderId}/cancel`, {}).subscribe({
            next: (response) => {
                alert(response.message);
                const userId = localStorage.getItem('userId');
                if (userId) {
                    this.loadUserOrders(userId); // Tải lại danh sách đơn hàng
                }
            },
            error: (error) => {
                console.error('Lỗi khi hủy đơn hàng:', error);
                alert('Không thể hủy đơn hàng.');
            }
        });
    }
}
}
