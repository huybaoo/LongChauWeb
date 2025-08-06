// src/app/services/user-order.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Order } from '../models/order.model';

@Injectable({
  providedIn: 'root',
})
export class UserOrderService {
  private apiUrl = 'http://localhost:3000/api/orders';

  constructor(private http: HttpClient) {}

  getOrdersByUserId(): Observable<Order[]> {
    const userId = localStorage.getItem('userId');
    return this.http.get<Order[]>(`${this.apiUrl}?userId=${userId}`); // Gọi API để lấy đơn hàng của người dùng
  }
}
