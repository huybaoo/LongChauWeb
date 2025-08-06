import mongoose from 'mongoose';

export interface IUser {
    _id: mongoose.Types.ObjectId;
    username: string;
    password: string;
    email: string;
    address: string;
    phone: string;
    created_at: Date;
}
// Định nghĩa schema cho người dùng
const UserSchema = new mongoose.Schema<IUser>({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, required: true },
  address: { type: String, required: true },
  phone: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
});

// Tạo model cho người dùng
const UserModel = mongoose.model<IUser>('users', UserSchema);
export default UserModel; // Xuất mặc định
