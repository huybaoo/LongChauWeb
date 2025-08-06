import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    private userKey = 'currentUser '; // Khóa để lưu thông tin người dùng trong localStorage

    constructor() { }

    // Lưu thông tin người dùng
    setUser (user: { id: string; name: string; email: string }) {
        localStorage.setItem(this.userKey, JSON.stringify(user));
    }

    // Lấy thông tin người dùng đã đăng nhập
    getUser () {
        const user = localStorage.getItem(this.userKey);
        return user ? JSON.parse(user) : null;
    }

    // Lấy user_id
    getUser_Id(): string | null {
        const user = this.getUser ();
        return user ? user.id : null; // Sử dụng user.id để lấy user_id
    }

    // Kiểm tra xem người dùng có đang đăng nhập hay không
    isLoggedIn(): boolean {
        return this.getUser () !== null; // Nếu có thông tin người dùng thì coi như đã đăng nhập
    }

    // Xóa thông tin người dùng khi đăng xuất
    clearUser () {
        localStorage.removeItem(this.userKey);
    }
}