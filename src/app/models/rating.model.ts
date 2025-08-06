import mongoose, { Document, Schema } from 'mongoose';

export interface IUser {
    _id: mongoose.Types.ObjectId;
    username: string;
}

export interface RatingViewModel {
  username: string;
  productId: string;
  orderId: string;
  userId: string;
  rating: number;
  comment?: string;
  createdAt?: Date;
}

export interface IRating {
  productId: string;
  orderId: string;
  userId: string;
  username?: string;
  rating: number;
  comment?: string;
  createdAt?: Date;
}

const RatingSchema: Schema = new Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
  rating: { type: Number, required: true },
  comment: { type: String },
  createdAt: { type: Date, default: Date.now },
});

// Tạo model cho Rating
const Rating = mongoose.model<IRating>('Rating', RatingSchema);
export default Rating;
