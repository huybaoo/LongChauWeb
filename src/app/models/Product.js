const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    name: { type: String, required: true },
    category_id: { type: mongoose.Schema.Types.ObjectId, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    stock: { type: Number, required: true },
    image: { type: String },
    created_at: { type: Date, default: Date.now }
});

const ProductModel = mongoose.model('Products', ProductSchema);

module.exports = ProductModel;