import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { HeaderAdminComponent } from '../../header-admin/header-admin.component';

@Component({
  selector: 'app-product-management',
  templateUrl: './product-management.component.html',
  styleUrls: ['./product-management.component.css'],
  imports: [RouterModule, CommonModule, HeaderAdminComponent],
  standalone: true
})
export class ProductManagementComponent implements OnInit {
  products: Product[] = [];

  constructor(private productService: ProductService, private router: Router) {}

  ngOnInit(): void {
    // Kiểm tra xem quản trị viên đã đăng nhập chưa
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Bạn cần phải đăng nhập để truy cập trang này.');
      this.router.navigate(['/login-admin']); // Chuyển hướng đến trang đăng nhập quản trị viên
      return; // Dừng thực hiện nếu chưa đăng nhập
    }

    this.loadProducts();
  }

  loadProducts(): void {
    this.productService.getAllProducts().subscribe(
      (data: Product[]) => {
        console.log('Dữ liệu sản phẩm nhận được:', data); // Kiểm tra dữ liệu
        this.products = data;
      },
      (error) => {
        console.error('Lỗi khi tải sản phẩm:', error);
      }
    );
  }

  deleteProduct(id: string): void {
    if (confirm('Bạn có chắc chắn muốn xóa sản phẩm này không?')) {
      this.productService.deleteProduct(id).subscribe(() => {
        this.products = this.products.filter((product) => product._id !== id);
        alert('Sản phẩm đã được xóa thành công');
      });
    }
  }

  editProduct(product: Product): void {
    this.router.navigate(['/admin/edit-product', product._id]); // Điều hướng đến trang sửa sản phẩm
  }

  getImagePath(imageName?: string): string {
    return imageName ? `assets/${imageName}` : 'assets/default-image.jpg'; // Đường dẫn đến hình ảnh mặc định
  }
}