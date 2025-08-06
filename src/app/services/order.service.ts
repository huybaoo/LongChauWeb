import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { Order } from '../models/order.model';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private orderData: any;
  private apiUrl = 'http://localhost:3000/api/orders';

  constructor(private http: HttpClient) {}

  setOrderData(data: any) {
    this.orderData = data;
  }

  getOrderData() {
    return this.orderData;
  }

  placeOrder(orderDetails: any): Observable<any> {
    const endpoint = orderDetails.payment_method === 'VNPay' 
      ?  `${this.apiUrl}/create_payment_url`
      : this.apiUrl;

    return this.http.post<any>(endpoint, orderDetails);
  }

  updateStock(products: any[]): Observable<any[]> {
    const stockUpdateObservables = products.map(product => {
        console.log(`Updating stock for product ID: ${product._id}, quantity: ${product.quantity}`);
        return this.http.patch<any>(`http://localhost:3000/api/products/${product._id}`, {
            quantity: product.quantity
        });
    });

    return forkJoin(stockUpdateObservables);
}

  getAllOrders(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

  getOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(this.apiUrl);
  }

  getOrderById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  getOrdersByUserId(): Observable<Order[]> {
    const userId = localStorage.getItem('userId');
    return this.http.get<Order[]>(`${this.apiUrl}?userId=${userId}`);
  }
}