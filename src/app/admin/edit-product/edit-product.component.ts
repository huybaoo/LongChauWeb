import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HeaderAdminComponent } from '../../header-admin/header-admin.component';

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.css'],
  imports: [FormsModule, CommonModule, RouterModule, HeaderAdminComponent],
  standalone: true
})
export class EditProductComponent implements OnInit {
  product: Product | undefined;

  constructor(
    private productService: ProductService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Kiểm tra xem quản trị viên đã đăng nhập chưa
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Bạn cần phải đăng nhập để truy cập trang này.');
      this.router.navigate(['/login-admin']); // Chuyển hướng đến trang đăng nhập quản trị viên
      return; // Dừng thực hiện nếu chưa đăng nhập
    }

    const id = this.route.snapshot.paramMap.get('id'); // Lấy ID từ URL
    if (id) {
      this.productService.getProductById(id).subscribe(
        (data: Product) => {
          this.product = data;
        },
        (error) => {
          console.error('Lỗi khi lấy sản phẩm:', error);
        }
      );
    }
  }

  saveProduct(): void {
    if (this.product) {
      console.log(this.product); 
      this.productService.updateProduct(this.product._id, this.product).subscribe(() => {
          alert('Cập nhật sản phẩm thành công');
          this.router.navigate(['/admin/products']); 
      }, error => {
          console.error('Lỗi khi cập nhật sản phẩm:', error); // Log lỗi nếu có
      });
    }
  }
}