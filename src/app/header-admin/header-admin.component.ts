import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header-admin',
  standalone: true,
  imports: [RouterModule,CommonModule],
  templateUrl: './header-admin.component.html',
  styleUrl: './header-admin.component.css'
})
export class HeaderAdminComponent {
  username: string | null = '';
  showLogout: boolean = false;
  currentAdmin: any = null;

  constructor( private router: Router) { }
  ngOnInit() {
    const admin = JSON.parse(localStorage.getItem('admin') || '{}');
    if (admin && admin.username) {
      this.username = admin.username;
    }
  }
  logout(): void {
    console.log('Đăng xuất được gọi');
    localStorage.removeItem('token'); // Xóa token
    localStorage.removeItem('admin'); // Xóa thông tin admin
    this.currentAdmin = null; // Đặt admin hiện tại về null
    this.username = null; // Đặt username về null
    this.router.navigate(['login-admin']); // Điều hướng đến trang đăng nhập
}
}
