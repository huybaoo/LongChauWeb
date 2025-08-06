import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../models/product.model';
import { tap } from 'rxjs/operators';


@Injectable({
  providedIn: 'root' // Hoặc bạn có thể cung cấp service này trong module
})
export class ProductService {
  private apiUrl = 'http://localhost:3000/api/products';


  constructor(private http: HttpClient) {}
// Tìm kiếm sản phẩm theo tên
  searchProducts(name: string): Observable<Product[]> {
  const url = `${this.apiUrl}/search?name=${name}`;
  return this.http.get<Product[]>(url).pipe(
    tap(products => console.log('Searched products:', products))
  );
  }

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl);
  }
  // Phương thức lấy sản phẩm theo category_id
  getProductsByCategory(categoryId: string): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/category/${categoryId}`);
  }
   //Gọi api chi tiết sản phẩm
  getProductById(id: string): Observable<Product> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<Product>(url);
  }
  //sản phẩm liên quan
  getRelatedProducts(productId: string): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/related-products/${productId}`);
  }
  updateProduct(id: string, product: Product): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, product); // Đường dẫn API tương ứng
  }

// Xóa sản phẩm
deleteProduct(id: string): Observable<any> {
  return this.http.delete(`${this.apiUrl}/${id}`);
}
getAllProducts(): Observable<Product[]> {
  return this.http.get<Product[]>(this.apiUrl);
}
// Thêm sản phẩm vào MongoDB
addProduct(product: any): Observable<any> {
  return this.http.post<any>(this.apiUrl, product);
}
}
