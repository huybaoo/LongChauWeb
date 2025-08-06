import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-rate-order',
  templateUrl: './rate-order.component.html',
  styleUrls: ['./rate-order.component.css'],
  standalone: true,
  imports: [FormsModule, CommonModule] // Thêm CommonModule vào đây
})
export class RateOrderComponent implements OnInit {
  orderId: string | null = null;
  productId: string | null = null; // Thêm khai báo cho productId
  rating: number = 0;
  comment: string = '';
  stars: number[] = [1, 2, 3, 4, 5];

  constructor(private route: ActivatedRoute, private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.orderId = this.route.snapshot.paramMap.get('orderId'); // Cập nhật để lấy orderId
    this.productId = this.route.snapshot.paramMap.get('productId'); // Cập nhật để lấy productId
  }

  submitRating(): void {
    if (this.orderId && this.productId) {
      const userId = localStorage.getItem('userId'); // Lấy userId từ localStorage
      console.log('User ID:', userId);  // Thêm log để kiểm tra userId
      const ratingData = {
        orderId: this.orderId,
        productId: this.productId,
        rating: this.rating,
        comment: this.comment,
        userId: userId // Gửi userId
      };
      this.http.post('http://localhost:3000/api/rate-order', ratingData)
        .subscribe(response => {
          alert('Đánh giá thành công!');
          this.router.navigate(['/product-detail', this.productId]);
        }, error => {
          console.error('Lỗi khi gửi đánh giá:', error);
        });
    }
  }

  goBack(): void {
    this.router.navigate(['/orders', this.orderId]);
  }
}
