import { Injectable } from '@angular/core';
import { Product } from '../models/product.model';
import { CartItem } from '../models/cart-item.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cart: CartItem[] = [];
  private orderItems: CartItem[] = [];
  private totalAmount: number = 0;

  constructor() {
    this.loadCartFromLocalStorage(); // Tải giỏ hàng từ localStorage khi khởi tạo service
  }

  // Lấy danh sách sản phẩm trong giỏ hàng
  getItems() {
    return this.cart;
  }

  // Thêm sản phẩm vào giỏ hàng
  addToCart(product: Product): void {
    const existingItem = this.cart.find(item => item.product._id === product._id);
    if (existingItem) {
      existingItem.quantity++; // Nếu sản phẩm đã có trong giỏ hàng, tăng số lượng
    } else {
      this.cart.push({ product, quantity: 1, selected: false }); // Nếu sản phẩm chưa có, thêm mới
    }
    this.saveCartToLocalStorage(); // Lưu giỏ hàng vào localStorage
  }

  // Xóa toàn bộ sản phẩm trong giỏ hàng
  clearCart() {
    this.cart = [];
    this.saveCartToLocalStorage(); // Lưu lại giỏ hàng trống
  }

  // Cập nhật để chỉ lưu các sản phẩm đã chọn
  setOrderItems(selectedProducts: CartItem[], totalAmount: number): void {
    this.orderItems = selectedProducts;
    this.totalAmount = totalAmount;
  }

  // Lấy thông tin sản phẩm đã đặt và tổng tiền
  getOrderItems() {
    return { items: this.orderItems, totalAmount: this.totalAmount };
  }

  // Lấy tổng tiền của giỏ hàng
  getTotalAmount() {
    return this.totalAmount; // Lấy tổng tiền
  }

  // Xóa sản phẩm khỏi giỏ hàng
  removeFromCart(productId: string): void {
    this.cart = this.cart.filter(item => item.product._id !== productId); // Lọc và xóa sản phẩm theo id
    this.saveCartToLocalStorage(); // Lưu giỏ hàng vào localStorage
  }

  // Cập nhật số lượng của sản phẩm trong giỏ hàng
  updateQuantity(productId: string, quantity: number): void {
    const item = this.cart.find(item => item.product._id === productId);
    if (item) {
      item.quantity = quantity;
      this.saveCartToLocalStorage(); // Lưu giỏ hàng vào localStorage
    }
  }

  // Lấy tất cả các sản phẩm trong giỏ hàng
  getCartItems(): CartItem[] {
    return this.cart;
  }

  // Lưu giỏ hàng vào localStorage
  saveCartToLocalStorage(): void {
    localStorage.setItem('cart', JSON.stringify(this.cart));
  }

  // Tải giỏ hàng từ localStorage khi người dùng quay lại
  loadCartFromLocalStorage(): void {
    const cartData = localStorage.getItem('cart');
    if (cartData) {
      this.cart = JSON.parse(cartData);
      this.cart.forEach(item => {
        // Đảm bảo tất cả sản phẩm khi tải lên đều chưa được chọn
        if (item.selected === undefined) {
          item.selected = false;
        }
      });
    }
  }

  // Xóa các sản phẩm đã chọn
  removeSelectedItems(selectedItems: CartItem[]) {
    // Chỉ lọc và xóa các sản phẩm có thuộc tính selected = true
    this.cart = this.cart.filter(item => 
      !selectedItems.some(selectedItem => selectedItem.product._id === item.product._id && selectedItem.selected)
    );
    this.saveCartToLocalStorage(); // Lưu lại giỏ hàng sau khi xóa các sản phẩm đã chọn
  }

  // Xử lý việc chọn tất cả các sản phẩm
  selectAllProducts(selectAll: boolean) {
    this.cart.forEach(item => {
      item.selected = selectAll;
    });
    this.saveCartToLocalStorage(); // Lưu giỏ hàng đã thay đổi
  }
}
