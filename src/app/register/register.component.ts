import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserService } from '../services/user.service'; // Import the service
@Component({
    selector: 'app-register',
    standalone: true,
    imports: [FormsModule, CommonModule],
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.css']
})
export class RegisterComponent {
    username: string = '';
    password: string = '';
    email: string = '';
    address: string = '';
    phone: string = '';
    message: string = '';

    constructor(private http: HttpClient, private router: Router, private userService: UserService) { }

    onSubmit() {
        const user = {
            username: this.username,
            password: this.password,
            email: this.email,
            address: this.address,
            phone: this.phone
        };
    
        this.http.post('http://localhost:3000/api/register', user).subscribe(
            response => {
                console.log('Đăng ký thành công:', response);
                this.message = 'Mã xác nhận đã được gửi đến email của bạn!';
                this.userService.setUser(user); // Store user data in the service
                this.router.navigate(['/verify']);
            },
            error => {
                console.error('Lỗi đăng ký:', error);
                this.message = 'Đã xảy ra lỗi trong quá trình đăng ký!';
            }
        );
    }
}