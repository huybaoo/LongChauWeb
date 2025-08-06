import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-add-product',
  standalone: true,
  imports: [FormsModule, RouterModule, CommonModule],
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css']
})
export class AddProductComponent implements OnInit {
  username: string | null = '';
  showLogout: boolean = false;
  currentAdmin: any = null;
  product = {
    name: '',
    price: 0,
    quantity: 0,
    description: '',
    image: '',
    category_id: '' // Thêm category_id vào đối tượng sản phẩm
  };

  constructor(private productService: ProductService, private router: Router) {}

  ngOnInit() {
    // Kiểm tra xem quản trị viên đã đăng nhập chưa
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Bạn cần phải đăng nhập để truy cập trang này.');
      this.router.navigate(['/login-admin']); // Chuyển hướng đến trang đăng nhập quản trị viên
      return; // Dừng thực hiện nếu chưa đăng nhập
    }

    const admin = JSON.parse(localStorage.getItem('admin') || '{}');
    if (admin && admin.username) {
      this.username = admin.username;
    }
  }

  // Phương thức để chọn và hiển thị ảnh sản phẩm
  onImageSelect(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.product.image = e.target.result;  // Lưu ảnh vào product.image
      };
      reader.readAsDataURL(file);  // Đọc file ảnh dưới dạng Data URL
    }
  }

  // Phương thức thêm sản phẩm
  addProduct() {
    // Kiểm tra các trường dữ liệu đầu vào
    if (!this.product.name || !this.product.price || !this.product.quantity || !this.product.category_id) {
      alert('Vui lòng điền đủ thông tin sản phẩm.');
      return;
    }

    if (this.product.price <= 0 || this.product.quantity <= 0) {
      alert('Giá và số lượng phải là số dương.');
      return;
    }

    this.productService.addProduct(this.product).subscribe(
      response => {
        console.log('Sản phẩm đã được thêm:', response);
        this.resetForm();  // Reset form sau khi thêm sản phẩm thành công
        this.router.navigate(['/admin/products']); // Điều hướng về trang danh sách sản phẩm
      },
      error => {
        console.error('Lỗi khi thêm sản phẩm:', error);
        alert('Có lỗi xảy ra khi thêm sản phẩm. Vui lòng thử lại sau.');
      }
    );
  }

  // Phương thức reset form
  resetForm() {
    this.product = {
      name: '',
      price: 0,
      quantity: 0,
      description: '',
      image: '',
      category_id: '' // Đặt lại category_id
    };
  }

  // Phương thức đăng xuất
  logout(): void {
    console.log('Đăng xuất được gọi');
    localStorage.removeItem('token'); // Xóa token
    localStorage.removeItem('admin'); // Xóa thông tin admin
    this.currentAdmin = null; // Đặt admin hiện tại về null
    this.username = null; // Đặt username về null
    this.router.navigate(['login-admin']); // Điều hướng đến trang đăng nhập
  }
}