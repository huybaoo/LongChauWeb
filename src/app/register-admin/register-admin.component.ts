import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
@Component({
  selector: 'app-register-admin',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './register-admin.component.html',
  styleUrl: './register-admin.component.css'
})
export class RegisterAdminComponent {
  username: string = '';
  password: string = '';
  email: string = '';

  constructor(private http: HttpClient, private router: Router) {}

  onRegister() {
    const registerData = {
      username: this.username,
      password: this.password,
      email: this.email
    };

    // Cập nhật lại URL của API
    this.http.post('http://localhost:3000/api/register-admin', registerData)
      .subscribe({
        next: (response) => {
          alert('Đăng ký thành công!');
          // Chuyển hướng đến trang đăng nhập
          this.router.navigate(['/login-admin']);
        },
        error: (error) => {
          alert('Đăng ký không thành công: ' + error.error);
        }
      });
  }
}