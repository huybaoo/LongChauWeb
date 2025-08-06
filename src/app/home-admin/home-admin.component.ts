import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
@Component({
  selector: 'app-home-admin',
  standalone: true,
  imports: [RouterModule,CommonModule],
  templateUrl: './home-admin.component.html',
  styleUrl: './home-admin.component.css'
})
export class HomeAdminComponent implements OnInit {
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
