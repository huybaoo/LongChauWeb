// src/app/models/order.model.ts
export interface ProductOrder {
    name: string;
    quantity: number;
    price: number;
    _id: string;
    image : string;
}

export interface Order {
    _id: string;
    user_id: string;
    order_date: Date;
    total_amount: number;
    status: string;
    fullName: string;
    phoneNumber: string;
    province: string;
    district: string;
    ward: string;
    address: string;
    note: string;
    products: ProductOrder[];
}

// Định nghĩa Response cho API hủy đơn hàng
export interface CancelOrderResponse {
    message: string;
    order?: Order; 
}