import { Component, OnInit } from '@angular/core';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../services/product.service';
import { Product } from '../models/product.model';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule, HeaderComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  currentPage = 0;
  itemsPerPage = 8;
  products: Product[] = [];
  currentUser: any = null;
  showLogout: boolean = false;
  searchTerm: string = '';

  // Getter cho sản phẩm phân trang
  get paginatedProducts() {
    const filteredProducts = this.searchProducts();
    const startIndex = this.currentPage * this.itemsPerPage;
    return filteredProducts.slice(startIndex, startIndex + this.itemsPerPage);
  }

  // Getter cho tổng số trang
  get totalPages() {
    const filteredProducts = this.searchProducts();
    return Math.ceil(filteredProducts.length / this.itemsPerPage);
  }

  // Phương thức chuyển sang trang tiếp theo
  nextPage() {
    if (this.currentPage < this.totalPages - 1) {
      this.currentPage++;
    }
  }

  // Phương thức quay lại trang trước
  prevPage() {
    if (this.currentPage > 0) {
      this.currentPage--;
    }
  }

  constructor(
    private productService: ProductService,
    private router: Router,
    private route: ActivatedRoute // Thêm ActivatedRoute vào constructor
  ) { }

  ngOnInit(): void {
    this.loadCurrentUser();
    this.route.queryParams.subscribe(params => {
      this.searchTerm = params['search'] || ''; // Lấy từ khóa tìm kiếm từ query params
      this.fetchProducts(params['category_id']); // Lấy category_id nếu có
    });
  }

  // Phương thức lấy sản phẩm
  fetchProducts(categoryId?: string): void {
    const fetchMethod = categoryId ? 
      () => this.productService.getProductsByCategory(categoryId) : 
      () => this.productService.getProducts();

    fetchMethod().subscribe(
      (data: Product[]) => {
        this.products = data;
        if (this.searchTerm) {
          this.products = this.searchProducts(); // Áp dụng tìm kiếm nếu có từ khóa
        }
      },
      error => {
        console.error('Lỗi khi lấy sản phẩm:', error);
      }
    );
  }

  // Phương thức tìm kiếm
  search() {
    if (this.searchTerm.trim()) {
      this.router.navigate(['/'], { queryParams: { search: this.searchTerm } });
    }
  }

  // Phương thức tìm kiếm sản phẩm
  searchProducts(): Product[] {
    if (!this.searchTerm) {
      return this.products; // Nếu không có từ khóa, trả về tất cả sản phẩm
    }
    return this.products.filter(product =>
      product.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  // Phương thức tải thông tin người dùng
  loadCurrentUser(): void {
    const user = localStorage.getItem('user');
    if (user) {
      this.currentUser = JSON.parse(user);
    }
  }

  // Phương thức đăng xuất
  logout(): void {
    console.log('Đăng xuất được gọi');
    localStorage.clear(); // Xóa tất cả thông tin lưu trữ
    this.currentUser = null;
    this.showLogout = false;
    this.router.navigate(['login']);
}

  // Phương thức lấy đường dẫn hình ảnh
  getImagePath(imageName?: string): string {
    return imageName ? `assets/${imageName}` : 'assets/default-image.jpg'; // Đường dẫn đến hình ảnh mặc định
  }
}