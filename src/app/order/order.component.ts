import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { OrderService } from '../services/order.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CartService } from '../services/cart.service';
import { CartItem } from '../models/cart-item.model';
import { HeaderComponent } from "../header/header.component";
import { AuthService } from '../services/auth.service';
import emailjs from 'emailjs-com';


// Tạo interface để định rõ cấu trúc của sản phẩm
interface Product {
  id: string;
  name: string;
  quantity: number;
  price: number;
  image: string;
}

// Định nghĩa kiểu dữ liệu của `orderData`
interface OrderData {
  products: Product[];
  totalAmount: number;
}

@Component({
  selector: 'app-order',
  standalone: true,
  imports: [RouterModule, CommonModule, ReactiveFormsModule, HeaderComponent],
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {
  userId: string | null = null;
  selectedProducts: CartItem[] = [];
  totalAmount: number = 0;
  orderForm: FormGroup;
  paymentSuccess: boolean = false;
  message: string | null = null;
  orderData: OrderData = {
    products: [],
    totalAmount: 0
  };

  provinces = [
    { id: 'HCM', name: 'TP Hồ Chí Minh' },
    { id: 'HN', name: 'Hà Nội' },
    { id: 'DN', name: 'Đà Nẵng' },
    { id: 'HGT', name: 'Hải Phòng' },
    { id: 'HAA', name: 'Hà Tĩnh' },
    { id: 'HG', name: 'Hưng Yên' },
    { id: 'LA', name: 'Lạng Sơn' },
    { id: 'NT', name: 'Nam Định' },
    { id: 'QT', name: 'Quảng Trị' },
    { id: 'QT', name: 'Quảng Ngãi' },
    { id: 'BL', name: 'Bến Tre' },
    { id: 'BN', name: 'Bắc Ninh' },
    { id: 'NIN', name: 'Ninh Bình' },
    { id: 'TH', name: 'Thái Bình' },
    { id: 'TN', name: 'Thái Nguyên' },
    { id: 'TA', name: 'Tây Ninh' },
    { id: 'VT', name: 'Vĩnh Long' },
    { id: 'BG', name: 'Bắc Giang' },
    { id: 'BG', name: 'Bình Dương' },
    { id: 'BT', name: 'Bình Thuận' },
    { id: 'HD', name: 'Hải Dương' },
    { id: 'HLA', name: 'Hà Nam' },
    { id: 'HP', name: 'Hải Phòng' },
    { id: 'CM', name: 'Cần Thơ' },
    { id: 'KV', name: 'Kiên Giang' },
    { id: 'SD', name: 'Sơn La' },
    { id: 'YD', name: 'Yên Bái' },
    { id: 'HLA', name: 'Hà Nam' },
    { id: 'LT', name: 'Lai Châu' },
    { id: 'MN', name: 'Móng Cái' },
    { id: 'SD', name: 'Sóc Trăng' },
    { id: 'CD', name: 'Cà Mau' },
    { id: 'DL', name: 'Đắk Lắk' },
    { id: 'DA', name: 'Đắk Nông' },
    { id: 'KH', name: 'Kon Tum' },
    { id: 'QN', name: 'Quảng Ninh' },
    { id: 'TG', name: 'Tiền Giang' },
    { id: 'VIT', name: 'Vĩnh Phúc' },
    { id: 'BA', name: 'Bà Rịa - Vũng Tàu' },
    { id: 'DTH', name: 'Đồng Tháp' },
    { id: 'BG', name: 'Bình Phước' },
    { id: 'GDN', name: 'Gia Lai' },
    { id: 'NGA', name: 'Nghệ An' },
    { id: 'TTH', name: 'Thừa Thiên Huế' },
  ];

  districts: { [key: string]: { id: string; name: string; }[] } = {
    HCM: [
      { id: 'TanBinh', name: 'Tân Bình' },
      { id: 'Quan1', name: 'Quận 1' },
      { id: 'Quan3', name: 'Quận 3' },
      { id: 'Quan4', name: 'Quận 4' },
      { id: 'Quan5', name: 'Quận 5' },
      { id: 'Quan6', name: 'Quận 6' },
      { id: 'Quan7', name: 'Quận 7' },
      { id: 'Quan8', name: 'Quận 8' },
      { id: 'Quan9', name: 'Quận 9' },
      { id: 'Quan10', name: 'Quận 10' },
      { id: 'Quan11', name: 'Quận 11' },
      { id: 'Quan12', name: 'Quận 12' },
      { id: 'BinhTan', name: 'Bình Tân' },
      { id: 'BinhThanh', name: 'Bình Thạnh' },
      { id: 'GoVap', name: 'Gò Vấp' },
      { id: 'PhuNhuan', name: 'Phú Nhuận' },
      { id: 'ThuDuc', name: 'Thủ Đức' },
      // Thêm các quận/huyện khác của TP Hồ Chí Minh ở đây
    ],
    HN: [
      { id: 'HoanKiem', name: 'Hoàn Kiếm' },
      { id: 'HoangMai', name: 'Hoàng Mai' },
      { id: 'HaiBaTrung', name: 'Hai Bà Trưng' },
      { id: 'CauGiay', name: 'Cầu Giấy' },
      { id: 'DongDa', name: 'Đống Đa' },
      { id: 'LongBien', name: 'Long Biên' },
      { id: 'NamTuLiem', name: 'Nam Từ Liêm' },
      { id: 'ThanhXuan', name: 'Thanh Xuân' },
      // Thêm các quận/huyện khác của Hà Nội ở đây
    ],
    DN: [
      { id: 'HaiChau', name: 'Hải Châu' },
      { id: 'ThanhKhe', name: 'Thanh Khê' },
      { id: 'LienChieu', name: 'Liên Chiểu' },
      { id: 'NguHanhSon', name: 'Ngũ Hành Sơn' },
      { id: 'SonTra', name: 'Sơn Trà' },
      { id: 'HoaVang', name: 'Hòa Vang' },
      { id: 'DienBan', name: 'Điện Bàn' },
      // Thêm các quận/huyện khác của Đà Nẵng ở đây
    ],
    // Thêm các huyện của các tỉnh khác ở đây
  };

  wards: { [key: string]: { id: string; name: string; }[] } = {
    TanBinh: [
      { id: 'Ward12', name: 'Phường 12' },
      { id: 'Ward14', name: 'Phường 14' },
      { id: 'Ward15', name: 'Phường 15' },
      // Thêm các phường/xã khác của quận Tân Bình ở đây
    ],
    HoanKiem: [
      { id: 'PhuongHangDa', name: 'Phường Hàng Đào' },
      { id: 'PhuongHangBuom', name: 'Phường Hàng Bồ' },
      { id: 'PhuongHangTrong', name: 'Phường Hàng Trống' },
      // Thêm các phường/xã khác của quận Hoàn Kiếm ở đây
    ],
    // Thêm các xã/phường của các quận khác ở đây
  };

  filteredDistricts: { id: string; name: string }[] = [];
  filteredWards: { id: string; name: string }[] = [];

  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private router: Router,
    private orderService: OrderService,
    private cartService: CartService,




  ) {
    this.orderForm = this.fb.group({
      fullName: ['', Validators.required],
      phoneNumber: ['', [Validators.required, Validators.pattern('^[0-9]{10,11}$')]],
      email: ['', [Validators.required, Validators.email]], 
      province: ['', Validators.required],
      district: ['', Validators.required],
      ward: ['', Validators.required],
      address: ['', Validators.required],
      note: ['']
    });
  }

  ngOnInit() {
    this.userId = localStorage.getItem('userId');




    this.loadSelectedItems(); // Đảm bảo chỉ lấy các sản phẩm đã chọn
    if (this.selectedProducts.length === 0) {
      this.router.navigate(['/cart']); // Điều hướng lại nếu không có sản phẩm nào được chọn
    }

    this.orderForm.get('province')?.valueChanges.subscribe((selectedProvince: string) => {
      this.filteredDistricts = this.districts[selectedProvince] || [];
      this.orderForm.get('district')?.reset();
      this.filteredWards = []; // Đặt lại danh sách phường/xã
    });

    this.orderForm.get('district')?.valueChanges.subscribe((selectedDistrict: string) => {
      this.filteredWards = this.wards[selectedDistrict] || [];
      this.orderForm.get('ward')?.reset();
    });


  }

  loadSelectedItems() {
    const orderData = this.cartService.getOrderItems(); // Lấy các sản phẩm đã chọn từ CartService
    if (orderData.items && orderData.items.length > 0) {
      this.selectedProducts = orderData.items; // Chỉ gán items cho selectedProducts
      this.orderData.products = orderData.items.map(item => ({
        id: item.product._id,
        name: item.product.name,
        quantity: item.quantity,
        price: item.product.price,
        image: item.product.image || 'default-image.jpg'
      }));
      this.orderData.totalAmount = orderData.totalAmount; // Gán tổng số tiền từ orderData
    } else {
      this.selectedProducts = [];
      this.orderData = { products: [], totalAmount: 0 };
    }
  }


onSubmit() {
  if (this.orderForm.valid && this.selectedProducts.length > 0) {
      const orderDetails = {
          user_id: this.userId,
          total_amount: this.calculateTotalAmount(),
          status: 'Đang chờ xác nhận',
          fullName: this.orderForm.value.fullName,
          phoneNumber: this.orderForm.value.phoneNumber,
          province: this.orderForm.value.province,
          district: this.orderForm.value.district,
          ward: this.orderForm.value.ward,
          address: this.orderForm.value.address,
          note: this.orderForm.value.note,
          email: localStorage.getItem('userEmail'), // Địa chỉ email người dùng
          products: this.selectedProducts.map(product => ({
              _id: product.product?._id,
              name: product.product.name,
              price: product.product.price,
              quantity: product.quantity
          }))
      };

      const productInfo = orderDetails.products.map(product => {
        return `Tên sản phẩm: ${product.name}, Giá: ${product.price}, Số lượng: ${product.quantity}<br>`;
    }).join('');

      // Cập nhật stock trước khi lưu đơn hàng
      this.orderService.updateStock(orderDetails.products).subscribe({
          next: () => {
              // Sau khi cập nhật stock thành công, đặt hàng
              this.orderService.placeOrder(orderDetails).subscribe({
                  next: (response) => {
                      // Gửi email hóa đơn
                      const templateParams = {
                        email: this.orderForm.value.email, // Địa chỉ email của người dùng
                        fullName: orderDetails.fullName, // Họ tên người đặt hàng
                        phoneNumber: orderDetails.phoneNumber,
                        total_amount: orderDetails.total_amount, // Tổng số tiền
                        address: orderDetails.address, // Địa chỉ
                        province: orderDetails.province, // Tỉnh
                        district: orderDetails.district, // Quận
                        ward: orderDetails.ward, // Phường
                        note: orderDetails.note, // Ghi chú
                        product_info: productInfo // Chuỗi thông tin sản phẩm
                    };

                      emailjs.send('service_wgo5m5a', 'template_ky0nso9', templateParams, '7oV_vV7xwhrwQvsb9')
                          .then(() => {
                              alert('Hóa đơn đã được gửi đến email của bạn!');
                          }, (error) => {
                              console.error('Lỗi khi gửi email:', error);
                          });

                      alert('Đặt hàng thành công!');
                      this.router.navigate(['/cart']);
                      this.cartService.removeSelectedItems(this.selectedProducts);
                      this.cartService.saveCartToLocalStorage();
                  },
                  error: (error) => {
                      console.error('Không thể lưu đơn hàng:', error);
                      alert('Đặt hàng thất bại.');
                  }
              });
          },
          error: (error) => {
              console.error('Cập nhật stock thất bại:', error);
              alert('Không thể cập nhật số lượng sản phẩm trong kho.');
          }
      });
  } else {
      this.orderForm.markAllAsTouched();
      alert('Vui lòng điền đầy đủ thông tin và chọn sản phẩm.');
  }
}

  private calculateTotalAmount(): number {
    return this.orderData.products.reduce((total, product) => {
      return total + (product.price * product.quantity);
    }, 0);
  }

  processPayment(orderDetails: any) {
    this.orderService.placeOrder(orderDetails).subscribe({
      next: (response) => {
        this.showMessage('Đặt hàng thành công!', true);

        // Chỉ xóa sản phẩm đã chọn, không phải toàn bộ giỏ hàng
        this.cartService.removeSelectedItems(this.selectedProducts);
      },
      error: (error) => {
        this.showMessage('Đặt hàng thất bại. Vui lòng thử lại.', false);
        console.error('Error placing order:', error);
      }
    });
  }


  private showMessage(message: string, success: boolean) {
    this.message = message;
    this.paymentSuccess = success;

    if (success) {
      setTimeout(() => {
        this.router.navigate(['/cart']); // Điều hướng về trang giỏ hàng sau khi thông báo
      }, 2000); // Đặt thời gian chờ là 2 giây (2000 ms), có thể điều chỉnh theo ý muốn
    }
  }

  getImagePath(imageName?: string): string {
    return imageName ? `assets/${imageName}` : 'assets/default-image.jpg'; // Đường dẫn đến hình ảnh mặc định
  }

  goBackToCart() {
    this.router.navigate(['/cart']);
  }
}
