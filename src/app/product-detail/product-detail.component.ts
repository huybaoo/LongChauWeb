import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CartService } from '../services/cart.service';
import { ProductService } from '../services/product.service';
import { ActivatedRoute } from '@angular/router';
import { HeaderComponent } from '../header/header.component';
import { Product } from '../models/product.model';
import { IRating } from '../models/rating.model';
import { RatingViewModel } from '../models/rating.model';
import { RouterModule } from '@angular/router';
import { HttpClientModule, HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [HeaderComponent, CommonModule, RouterModule, HttpClientModule],
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {
  product: Product | null = null;
  relatedProducts: Product[] = [];
  ratings: IRating[] = [];

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private cartService: CartService,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const productId = params['id'];
      if (productId) {
        this.getProductDetail();
        this.getRelatedProducts();
        this.getRatings();
      }
    });
  }

  getProductDetail(): void {
    const productId = this.route.snapshot.paramMap.get('id');
    if (productId) {
      this.productService.getProductById(productId).subscribe(
        (data: Product) => {
          this.product = data;
        },
        (error) => {
          console.error('Lỗi khi lấy sản phẩm:', error);
        }
      );
    }
  }

  getRelatedProducts(): void {
    const productId = this.route.snapshot.paramMap.get('id');
    if (productId) {
      this.productService.getRelatedProducts(productId).subscribe(
        (data: Product[]) => {
          this.relatedProducts = data;
        },
        (error) => {
          console.error('Lỗi khi lấy sản phẩm liên quan:', error);
        }
      );
    }
  }

  getRatings(): void {
    const productId = this.route.snapshot.paramMap.get('id');
    if (productId) {
      this.http.get<RatingViewModel[]>(`http://localhost:3000/api/ratings?productId=${productId}`).subscribe(
        (data) => {
          this.ratings = data.map((rating) => ({
            ...rating,
            username: rating.username || 'Người dùng', // Thêm giá trị mặc định
          }));
        },
        (error) => {
          console.error('Lỗi khi lấy đánh giá:', error);
        }
      );
    }
  }

  navigateToProductDetail(productId: string): void {
    console.log('Navigating to product id:', productId);
    this.router.navigate(['/product', productId]); // Sử dụng navigate thay vì navigateByUrl
  }

  addToCart(): void {
    if (this.product) {
      this.cartService.addToCart(this.product);
      alert('Sản phẩm đã được thêm vào giỏ hàng.');
    }
  }

  getImagePath(imageName?: string): string {
    return imageName ? `assets/${imageName}` : 'assets/default-image.jpg';
  }
}
