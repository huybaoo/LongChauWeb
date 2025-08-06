import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserService } from '../services/user.service';

@Component({
    selector: 'app-verify',
    standalone: true,
    imports: [FormsModule, CommonModule],
    templateUrl: './verify.component.html',
    styleUrls: ['./verify.component.css']
})
export class VerifyComponent {
    email: string = '';
    verificationCode: string = '';
    message: string = '';
    user: any; // Biến để lưu trữ dữ liệu người dùng

    constructor(private http: HttpClient, private router: Router, private userService: UserService) {}

    ngOnInit() {
        this.user = this.userService.getUser(); // Lấy dữ liệu người dùng từ service
        if (this.user) {
            this.email = this.user.email; // Thiết lập email từ dữ liệu người dùng
        }
    }

    verifyCode() {
        if (!this.verificationCode) {
            this.message = 'Vui lòng nhập mã xác nhận.';
            return;
        }

        const verificationData = {
            email: this.email,
            code: this.verificationCode
        };

        // Gọi API xác minh mã
        this.http.post('http://localhost:3000/api/verify-code', verificationData).subscribe(
            response => {
                console.log('Xác nhận thành công:', response);
                // Thông báo thành công và điều hướng đến trang đăng nhập
                this.message = 'Xác nhận thành công! Bạn có thể đăng nhập.';
                this.router.navigate(['/login']);
            },
            error => {
                console.error('Lỗi xác nhận:', error);
                this.message = error.status === 400 
                    ? 'Mã xác nhận không đúng. Xin vui lòng thử lại.' 
                    : 'Đã xảy ra lỗi. Vui lòng thử lại sau.';
            }
        );
    }
}