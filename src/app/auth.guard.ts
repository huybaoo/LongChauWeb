import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {
    constructor(private router: Router) {}

    canActivate(): boolean {
        const admin = JSON.parse(localStorage.getItem('admin') || '{}');
        if (admin && admin.username) {
            return true; // Cho phép truy cập
        } else {
            this.router.navigate(['login-admin']); // Chuyển hướng nếu chưa đăng nhập
            return false; // Không cho phép truy cập
        }
    }
}