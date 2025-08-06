import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common'; 
import { CartService } from '../services/cart.service';
import { HeaderComponent } from "../header/header.component"; 
import { CartItem } from '../models/cart-item.model'; 
import { Router } from '@angular/router';
import { FooterComponent } from "../footer/footer.component";

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [RouterModule, CommonModule, HeaderComponent, FooterComponent],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  products: any[] = [];
  totalAmount: number = 0;
  totalQuantity: number = 0;
  allProductsSelected: boolean = true;

  constructor(private cartService: CartService, private router: Router) {
    this.products = this.cartService.getItems(); // Lấy sản phẩm từ giỏ hàng
    this.updateTotal();
  }

  ngOnInit(): void {
    this.cartService.loadCartFromLocalStorage(); // Tải giỏ hàng từ localStorage
    this.loadCartItems();
  }

  loadCartItems(): void {
    this.products = this.cartService.getCartItems();
    this.calculateTotal();
  }

  calculateTotal(): void {
    this.totalAmount = this.products.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
    this.totalQuantity = this.products.reduce((acc, item) => acc + item.quantity, 0);
  }

  increaseQuantity(index: number): void {
    const productId = this.products[index].product._id;
    this.cartService.updateQuantity(productId, this.products[index].quantity + 1);
    this.loadCartItems(); // Tải lại giỏ hàng để cập nhật
  }
  
  decreaseQuantity(index: number): void {
    const productId = this.products[index].product._id;
    const newQuantity = this.products[index].quantity - 1;
    if (newQuantity > 0) {
      this.cartService.updateQuantity(productId, newQuantity);
    } else {
      this.removeProductWithConfirmation(index); // Gọi hàm xác nhận xóa sản phẩm nếu số lượng <= 0
    }
  }

  updateQuantity(index: number, quantity: string): void {
    const productId = this.products[index].product._id;
    const newQuantity = parseInt(quantity, 10);
    if (newQuantity > 0) {
      this.cartService.updateQuantity(productId, newQuantity);
    }
    this.loadCartItems();
  }

  updateTotal() {
    this.totalAmount = this.products.reduce((acc, product) => {
      if (product.selected) {
        return acc + product.product.price * product.quantity;
      }
      return acc;
    }, 0); // Tính tổng tiền sản phẩm đã chọn
    this.totalQuantity = this.products.reduce((acc, product) => acc + product.quantity, 0); // Tính tổng số lượng sản phẩm
  }

  // Xác nhận xóa sản phẩm
  confirmRemoveProduct(index: number) {
    const confirmed = confirm('Bạn có muốn xóa sản phẩm này không?');
    if (confirmed) {
      this.removeProduct(index); // Nếu người dùng xác nhận, xóa sản phẩm
    }
  }

  // Xóa sản phẩm khỏi giỏ hàng
  removeProduct(index: number): void {
    this.cartService.removeFromCart(this.products[index].product._id);
    this.loadCartItems();
    this.saveCartToLocalStorage(); // Lưu lại giỏ hàng sau khi xóa sản phẩm
  }

  // Hàm xác nhận xóa sản phẩm khi số lượng <= 0
  removeProductWithConfirmation(index: number): void {
    const confirmed = confirm('Sản phẩm này sẽ bị xóa vì số lượng là 0. Bạn có muốn tiếp tục?');
    if (confirmed) {
      this.removeProduct(index); // Nếu người dùng xác nhận, xóa sản phẩm
    }
  }

  toggleProductSelection(index: number, event: Event): void {
    this.products[index].selected = (event.target as HTMLInputElement).checked;
    this.updateTotal();
    this.saveCartToLocalStorage(); // Lưu lại giỏ hàng khi thay đổi sự lựa chọn
  }

  checkAllSelected() {
    this.allProductsSelected = this.products.every(product => product.selected);
  }

  checkout() {
    const userId = localStorage.getItem('userId'); // Kiểm tra xem người dùng đã đăng nhập hay chưa
    if (!userId) {
        alert('Bạn cần phải đăng nhập để mua hàng.'); // Hiển thị thông báo
        this.router.navigate(['/login']); // Chuyển hướng đến trang đăng nhập
        return; // Dừng lại nếu chưa đăng nhập
    }

    const selectedProducts = this.products.filter(product => product.selected);
    if (selectedProducts.length > 0) {
        this.cartService.setOrderItems(selectedProducts, this.totalAmount); // Lưu thông tin sản phẩm đã chọn
        this.router.navigate(['/order']); // Điều hướng sang trang order
    } else {
        alert('Hãy chọn sản phẩm bạn muốn mua.');
    }
}

  toggleSelectAll(event: any) {
    const selected = event.target.checked;
    this.allProductsSelected = selected;
    this.products.forEach(product => product.selected = selected);
    this.updateTotal();
    this.saveCartToLocalStorage(); // Lưu lại giỏ hàng khi chọn tất cả
  }

  getImagePath(imageName?: string): string {
    return imageName ? `assets/${imageName}` : 'assets/default-image.jpg';
  }

  saveCartToLocalStorage() {
    localStorage.setItem('cart', JSON.stringify(this.products)); // Lưu giỏ hàng vào localStorage
  }
  
}
