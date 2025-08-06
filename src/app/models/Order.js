const mongoose = require('mongoose');


const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  _id: { type: mongoose.Schema.Types.ObjectId, required: true } // Đảm bảo _id bắt buộc
});

const orderDataSchema = new mongoose.Schema({
  products: [productSchema],
  totalAmount: { type: Number, required: true }
});


const orderSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  order_date: { type: Date, default: Date.now },
  total_amount: { type: Number, required: true },
  status: { type: String, default: 'pending' },
  fullName: { type: String, required: true },
  phoneNumber: { type: String, required: true, match: [/^\d{10}$/, 'Số điện thoại phải có 10 chữ số'] },
  province: { type: String, required: true },
  district: { type: String, required: true },
  ward: { type: String, required: true },
  address: { type: String, required: true },
  note: { type: String },
  products: [{
    _id: { type: mongoose.Schema.Types.ObjectId, required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    image: { type: String }
  }]
}, { timestamps: true });

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
