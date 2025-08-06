import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../services/product.service';
import { Product } from '../models/product.model';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit  {
  currentPage = 0;
  itemsPerPage = 8;
  products: Product[] = [];
  currentUser: any = null;
  showLogout: boolean = false;
  searchTerm: string = '';



  get paginatedProducts() {
    const filteredProducts = this.searchProducts();
    const startIndex = this.currentPage * this.itemsPerPage;
    return filteredProducts.slice(startIndex, startIndex + this.itemsPerPage);
  }

  get totalPages() {
    const filteredProducts = this.searchProducts();
    return Math.ceil(filteredProducts.length / this.itemsPerPage);
  }

  nextPage() {
    if (this.currentPage < this.totalPages - 1) {
      this.currentPage++;
    }
  }

  prevPage() {
    if (this.currentPage > 0) {
      this.currentPage--;
    }
  }

  constructor(private productService: ProductService, private router: Router) { }


  ngOnInit(): void {
    this.fetchProducts();
    this.loadCurrentUser();
  }

  search() {
    if (this.searchTerm.trim()) {
      this.router.navigate(['/'], { queryParams: { search: this.searchTerm } });
    }
  }


  fetchProducts(): void {
    this.productService.getProducts().subscribe(
      (data: Product[]) => {
        this.products = data;
        console.log('Dữ liệu sản phẩm:', this.products); // Kiểm tra dữ liệu
      },
      error => {
        console.error('Lỗi khi lấy sản phẩm:', error);
      }
    );
  }

  loadCurrentUser(): void {
    const user = localStorage.getItem('user');
    if (user) {
      this.currentUser = JSON.parse(user);
    }
  }

  logout(): void {
    console.log('Đăng xuất được gọi');
    localStorage.clear(); // Xóa tất cả thông tin lưu trữ
    this.currentUser = null;
    this.showLogout = false;
    this.router.navigate(['login']);
}

  getImagePath(imageName?: string): string {
    return imageName ? `assets/${imageName}` : 'assets/default-image.jpg'; // Đường dẫn đến hình ảnh mặc định
  }

  searchProducts(): Product[] {
    if (!this.searchTerm) {
      return this.products; // Nếu không có từ khóa, trả về tất cả sản phẩm
    }
    return this.products.filter(product =>
      product.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }
}
