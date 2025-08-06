export interface Product {
    _id: string; 
    name: string;
    category_id: string;
    description?: string;
    price: number;
    stock: number;
    image?: string;
    created_at: Date;
  }
  