import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

interface AdminResponse {
  token: string;
  admin: {
    username: string;
    email: string;
  };
}
@Component({
  selector: 'app-login-admin',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login-admin.component.html',
  styleUrls: ['./login-admin.component.css']
})
export class LoginAdminComponent {
  username: string = '';
  password: string = '';
  message: string = '';

  constructor(private http: HttpClient, private router: Router) {}

  onSubmit() {
    const admin = {
      username: this.username,
      password: this.password
    };
    
    this.http.post<AdminResponse>('http://localhost:3000/api/login-admin', admin).subscribe(
      response => {
        this.message = 'Đăng nhập thành công!';
        localStorage.setItem('token', response.token);
        localStorage.setItem('admin', JSON.stringify(response.admin)); // Lưu thông tin người dùng
        this.router.navigate(['/home-admin']);
      },
      error => {
        console.error('Lỗi đăng nhập:', error);
        this.message = 'Tên đăng nhập hoặc mật khẩu không đúng!';
      }
    );
  }
}
