import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class UserService {
    private isLoggedIn: boolean = false;
    private userData: any = null; // Variable to hold user data
    constructor() {
        // Kiểm tra trạng thái đăng nhập từ LocalStorage khi khởi tạo dịch vụ
        this.isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
      }
    // Method to set user data
    setUser(data: any) {
        this.userData = data;
    }

    // Method to get user data
    getUser() {
        return this.userData;
    }

    // Method to clear user data
    clearUser() {
        this.userData = null;
    }
    setLoggedIn(status: boolean) {
        this.isLoggedIn = status;
        localStorage.setItem('isLoggedIn', status.toString());
      }
    
    checkLoggedIn(): boolean {
        return this.isLoggedIn;
      }
}