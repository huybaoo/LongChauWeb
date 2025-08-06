// models/cart-item.model.ts
import { Product } from './product.model'; // Import mô hình sản phẩm

export interface CartItem {
  product: Product; // Sản phẩm
  quantity: number; // Số lượng
  selected?: boolean; // Thêm thuộc tính selected
}