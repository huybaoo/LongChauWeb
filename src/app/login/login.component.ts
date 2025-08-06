import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

interface LoginResponse {
  token: string;
  user: {
    _id: string;
    username: string;
    email: string;
    address: string;
    phone: string;
  };
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  message: string = '';

  constructor(private http: HttpClient, private router: Router) { }

  onSubmit() {
    const user = {
      username: this.username,
      password: this.password
    };

    this.http.post<LoginResponse>('http://localhost:3000/api/login', user).subscribe(
      response => {
        this.message = 'Đăng nhập thành công!';

        // Lưu token và thông tin người dùng vào localStorage
        localStorage.setItem('token', response.token);
        localStorage.setItem('userId', response.user._id); // Lưu ID người dùng
        localStorage.setItem('user', JSON.stringify(response.user)); // Lưu thông tin người dùng

        // Điều hướng về trang chính
        this.router.navigate(['/']);
      },
      error => {
        console.error('Lỗi đăng nhập:', error);
        this.message = 'Tên đăng nhập hoặc mật khẩu không đúng!';
      }
    );
  }
}