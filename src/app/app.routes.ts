import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { CartComponent } from './cart/cart.component';
import { IntroComponent } from './intro/intro.component';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { RegisterComponent } from './register/register.component';
import { LoginAdminComponent } from './login-admin/login-admin.component';
import { RegisterAdminComponent } from './register-admin/register-admin.component';
import { HomeAdminComponent } from './home-admin/home-admin.component';
import { AuthGuard } from './auth.guard'; // Import AuthGuard
import { ProductManagementComponent } from './admin/product-management/product-management.component';
import { EditProductComponent } from './admin/edit-product/edit-product.component';
import { AddProductComponent } from './admin/add-product/add-product.component';
import { OrderListComponent } from './order-list/order-list.component';
import { OrderDetailComponent } from './order-detail/order-detail.component';
import { OrdersUserComponent } from './orders-user/orders-user.component';
import { OrderComponent } from './order/order.component';
import { VerifyComponent } from './verify/verify.component';
import { RateOrderComponent } from './rate-order/rate-order.component';
export const routes: Routes = [
  { path: '', component: HomeComponent }, // Đường dẫn trang chủ
  { path: 'login', component: LoginComponent }, // Đường dẫn trang đăng nhập
  { path: 'verify', component: VerifyComponent },
  { path: 'product/:id', component: ProductDetailComponent },
  { path: 'intro', component: IntroComponent },
  { path: 'cart', component: CartComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'login-admin', component: LoginAdminComponent },
  { path: 'register-admin', component: RegisterAdminComponent },
  { path: 'home-admin', component: HomeAdminComponent, canActivate: [AuthGuard] }, // Thêm AuthGuard
  { path :'admin/products', component : ProductManagementComponent},
  { path : 'admin/edit-product/:id',component :EditProductComponent},
  { path :'add-product', component : AddProductComponent},
  { path: 'admin/orders', component: OrderListComponent },
  { path: 'orders/:id', component: OrderDetailComponent },
  { path: 'orders-user', component: OrdersUserComponent },
  { path: 'order',component: OrderComponent},
  { path: 'admin/orders', component: OrderListComponent },
  { path: 'orders/:id', component: OrderDetailComponent },
  { path: 'orders-user', component: OrdersUserComponent },
  { path: 'rate-order/:orderId/:productId', component: RateOrderComponent },
];