const express = require('express');
const mongoose = require('mongoose');
const UserModel = require('./models/User'); 
const ProductModel = require('./models/Product');
const AdminModel = require('./models/Admin')
const Order = require('./models/Order');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); // Import jwt
const app = express();
const PORT = 3000;
const bodyParser = require('body-parser');
const router = express.Router();
const nodemailer = require('nodemailer');
const { ObjectId } = require('mongoose').Types;
const Rating = require('./models/Rating');

app.use(cors({
    origin: 'http://localhost:4200',
    optionsSuccessStatus: 200
}));
app.use(express.json());

// Cấu hình Nodemailer
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: '2254810141@vaa.edu.vn', // Thay thế bằng địa chỉ email của bạn
        pass: 'zzvy djeb fviq vdsu' // Thay thế bằng mật khẩu email của bạn
    }
});

// Định nghĩa chuỗi kết nối
const uri = 'mongodb+srv://2254810142:letrongtan1@pharmacycluster.hbmen.mongodb.net/pharmacy?retryWrites=true&w=majority';

// Kết nối đến MongoDB
mongoose.connect(uri)
    .then(() => {
        console.log('Kết nối đến MongoDB thành công');
    })
    .catch(err => {
        console.error('Kết nối đến MongoDB thất bại:', err);
    });

// API lấy tất cả sản phẩm
app.get('/api/products', async (req, res) => {
    try {
        const products = await ProductModel.find();
        if (!products || products.length === 0) {
            return res.status(404).send('Không tìm thấy sản phẩm.');
        }
        res.json(products);
    } catch (error) {
        console.error('Lỗi khi lấy sản phẩm:', error);
        res.status(500).send('Có lỗi xảy ra khi lấy sản phẩm');
    }
});

// API lấy sản phẩm theo CATEGORY_ID
app.get('/api/products/category/:category_id', async (req, res) => {
    try {
        const categoryId = req.params.category_id.toString();

        // Kiểm tra tính hợp lệ của categoryId
        if (!categoryId) {
            return res.status(400).send('ID danh mục không hợp lệ');
        }

        // Lấy danh sách sản phẩm theo categoryId
        const products = await ProductModel.find({ category_id: categoryId });

        if (!products || products.length === 0) {
            return res.status(404).send('Không tìm thấy sản phẩm');
        }

        res.json(products);
    } catch (error) {
        console.error('Lỗi khi lấy sản phẩm:', error);
        res.status(500).send('Có lỗi xảy ra khi lấy sản phẩm');
    }
});
// API lấy sản phẩm theo ID
app.get('/api/products/:id', async (req, res) => {
    try {
        const productId = req.params.id;
        console.log('ID sản phẩm nhận được:', productId);
        
        if (!ObjectId.isValid(productId)) {
            console.log('ID không hợp lệ:', productId);
            return res.status(400).send('ID không hợp lệ.');
        }

        const product = await ProductModel.findOne({ _id: new ObjectId(productId) });
        console.log('Sản phẩm tìm thấy:', product);

        if (!product) {
            return res.status(404).send('Không tìm thấy sản phẩm.');
        }
        res.json(product);
    } catch (error) {
        console.error('Lỗi khi lấy sản phẩm:', error);
        res.status(500).send('Có lỗi xảy ra khi lấy sản phẩm');
    }
});

const userSessions = {}; // In-memory store for temporary user data
// API đăng ký
app.post('/api/register', async (req, res) => {
    const { username, password, email, address, phone } = req.body;

    if (!username || !password || !email || !address || !phone) {
        return res.status(400).send('Tất cả các trường là bắt buộc.');
    }

    try {
        const existingUser = await UserModel.findOne({ username });
        if (existingUser) {
            return res.status(400).send('Người dùng đã tồn tại.');
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds); // Băm mật khẩu

        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString(); // Tạo mã 6 chữ số ngẫu nhiên
        
        // Lưu tạm thời dữ liệu người dùng
        userSessions[email] = { username, password: hashedPassword, address, phone, verificationCode };

        // Gửi mã xác nhận qua email
        const mailOptions = {
            from: 'your-email@gmail.com',
            to: email,
            subject: 'Mã xác nhận đăng ký',
            text: `Mã xác nhận của bạn là: ${verificationCode}`
        };

        await transporter.sendMail(mailOptions); // Gửi email

        res.status(201).send({ message: 'Mã xác nhận đã được gửi đến email của bạn!' });
    } catch (error) {
        console.error('Lỗi trong quá trình đăng ký:', error.message);
        res.status(500).send('Đã xảy ra lỗi trong quá trình đăng ký.');
    }
});
  
// API xác minh mã
app.post('/api/verify-code', async (req, res) => {
    const { email, code } = req.body;
    const userSession = userSessions[email];

    if (!userSession || userSession.verificationCode !== code) {
        return res.status(400).send('Mã xác nhận không đúng.');
    }

    // Lưu người dùng vào cơ sở dữ liệu
    const newUser = new UserModel({
        username: userSession.username,
        password: userSession.password, // Mật khẩu đã băm
        email,
        address: userSession.address,
        phone: userSession.phone,
    });

    try {
        await newUser.save();
        delete userSessions[email]; // Xóa phiên sau khi lưu người dùng
        res.status(200).send({ message: 'Xác nhận thành công! Người dùng đã được lưu.' });
    } catch (error) {
        console.error('Lỗi lưu người dùng:', error);
        res.status(500).send('Đã xảy ra lỗi khi lưu người dùng.');
    }
});

  // API đăng nhập
  app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
  
    if (!username || !password) {
        return res.status(400).send('Username và password là bắt buộc.');
    }
  
    try {
        const user = await UserModel.findOne({ username });
        if (!user) {
            return res.status(404).send('Người dùng không tồn tại.');
        }
  
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).send('Tên đăng nhập hoặc mật khẩu không hợp lệ.');
        }
  
        const token = jwt.sign({ id: user._id }, 'secret', { expiresIn: '1h' });
        res.json({ token, user, cart: user.cart }); // Trả về giỏ hàng cùng dữ liệu người dùng
    } catch (error) {
        console.error('Lỗi trong quá trình đăng nhập:', error);
        res.status(500).send('Đã xảy ra lỗi trong quá trình đăng nhập.');
    }
  });



// API đăng ký Admin
app.post('/api/register-admin', async (req, res) => {
    const { username, password, email } = req.body;

    // Kiểm tra các trường có được cung cấp không
    if (!username || !password || !email) {
        return res.status(400).send('Tất cả các trường là bắt buộc.');
    }

    try {
        // Kiểm tra xem admin đã tồn tại hay chưa
        const existingAdmin = await AdminModel.findOne({ username });
        if (existingAdmin) {
            return res.status(400).send('Người dùng đã tồn tại.');
        }

        // Mã hóa mật khẩu
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Tạo tài khoản admin mới
        const newAdmin = new AdminModel({
            username,
            password: hashedPassword,
            email
        });

        await newAdmin.save();
        res.status(201).send({ message: 'Đăng ký thành công! Vui lòng đăng nhập.' });
    } catch (error) {
        console.error('Lỗi trong quá trình đăng ký:', error.message);
        res.status(500).send('Đã xảy ra lỗi trong quá trình đăng ký.');
    }
});
// Đăng nhập Admin
app.post('/api/login-admin', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).send('Username và password là bắt buộc.');
    }

    try {
        const admin = await AdminModel.findOne({ username });
        if (!admin) {
            return res.status(404).send('Người dùng không tồn tại.');
        }

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.status(401).send('Tên đăng nhập hoặc mật khẩu không hợp lệ.');
        }

        const token = jwt.sign({ id: admin._id }, 'secret', { expiresIn: '1h' });
        res.json({ token, admin });
    } catch (error) {
        console.error('Lỗi trong quá trình đăng nhập:', error);
        res.status(500).send('Đã xảy ra lỗi trong quá trình đăng nhập.');
    }
});



// Route lấy đơn hàng theo ID
router.get('/orders/:id', (req, res) => {
    const orderId = req.params.id;

    Order.findById(orderId)
      .then(order => {
        if (!order) {
          return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
        }
        res.json(order);
      })
      .catch(err => {
        console.error('Lỗi khi lấy đơn hàng:', err);
        res.status(500).json({ message: 'Có lỗi xảy ra' });
      });
});

// API tìm kiếm sản phẩm
app.get('/api/products/search', async (req, res) => {
    const { name } = req.query;
    try {
      const products = await Product.find({ name: { $regex: name, $options: 'i' } });
      res.json(products);
    } catch (error) {
      res.status(500).send(error);
    }
  });

// Sử dụng router cho các route liên quan đến orders
app.use('/api', router);

//Thêm đơn hàng
app.post('/api/products', async (req, res) => {
    try {
        const newProduct = new ProductModel({
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            stock: req.body.stock || 0,
            image: req.body.image,
            category_id: req.body.category_id // Chuyển đổi category_id sang ObjectId
        });

        await newProduct.save();
        res.status(201).json(newProduct);
    } catch (error) {
        console.error('Lỗi khi thêm sản phẩm:', error);
        res.status(400).json({ message: 'Lỗi khi thêm sản phẩm', error });
    }
});

// Middleware để tăng giới hạn payload
app.use(express.json({ limit: '50mb' })); // Tăng giới hạn lên 10MB cho dữ liệu JSON
app.use(express.urlencoded({ limit: '50mb', extended: true })); // Tăng giới hạn cho dữ liệu URL-encoded


// API sửa sản phẩm
app.put('/api/products/:id', async (req, res) => {
    try {
        const productId = req.params.id;
        const updatedData = req.body;

        if (!ObjectId.isValid(productId)) {
            return res.status(400).send('ID không hợp lệ.');
        }

        const product = await ProductModel.findByIdAndUpdate(
            productId,
            updatedData,
            { new: true } // Trả về sản phẩm đã cập nhật
        );

        if (!product) {
            return res.status(404).send('Không tìm thấy sản phẩm để cập nhật.');
        }
        
        res.json({ message: 'Cập nhật sản phẩm thành công', product });
    } catch (error) {
        console.error('Lỗi khi cập nhật sản phẩm:', error);
        res.status(500).send('Có lỗi xảy ra khi cập nhật sản phẩm');
    }
});

// API xóa sản phẩm
app.delete('/api/products/:id', async (req, res) => {
    try {
        const productId = req.params.id;

        if (!ObjectId.isValid(productId)) {
            return res.status(400).send('ID không hợp lệ.');
        }

        const product = await ProductModel.findByIdAndDelete(productId);

        if (!product) {
            return res.status(404).send('Không tìm thấy sản phẩm để xóa.');
        }

        res.json({ message: 'Xóa sản phẩm thành công' });
    } catch (error) {
        console.error('Lỗi khi xóa sản phẩm:', error);
        res.status(500).send('Có lỗi xảy ra khi xóa sản phẩm');
    }
});

// Sử dụng router cho các route liên quan đến orders
app.use('/api', router);

// API lấy tất cả đơn hàng
app.get('/api/orders', async (req, res) => {
    try {
        const orders = await Order.find();
        if (!orders || orders.length === 0) {
            return res.status(404).send('Không tìm thấy đơn hàng.');
        }
        res.json(orders);
    } catch (error) {
        console.error('Lỗi khi lấy đơn hàng:', error);
        res.status(500).send('Có lỗi xảy ra khi lấy đơn hàng');
    }
});

// API lấy chi tiết hóa đơn theo ID
app.get('/api/orders/:id', async (req, res) => {
    const { id } = req.params;
  
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Order ID không hợp lệ' });
    }
  
    try {
        const order = await Order.findById(id).populate('products._id', 'image'); // Thêm phần populate
        if (!order) {
            return res.status(404).json({ message: 'Không tìm thấy đơn hàng.' });
        }
        res.json(order);
    } catch (error) {
        console.error('Lỗi khi lấy chi tiết đơn hàng:', error);
        res.status(500).json({ message: 'Có lỗi xảy ra khi lấy chi tiết đơn hàng.', error: error.message });
    }
  });
  
// API lấy đơn hàng theo ID người dùng
app.get('/api/user-orders', async (req, res) => {
    const userId = req.query.userId; // Lấy userId từ query parameters
  
    // Kiểm tra xem userId có tồn tại không
    if (!userId) {
        return res.status(400).json({ message: 'User ID is required' });
    }
  
    // Kiểm tra tính hợp lệ của userId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ message: 'User ID không hợp lệ' });
    }
  
    try {
        const orders = await Order.find({ user_id: new mongoose.Types.ObjectId(userId) }); // Lấy đơn hàng cho userId
        if (!orders || orders.length === 0) {
            return res.status(404).json({ message: 'Không tìm thấy đơn hàng cho người dùng này.' });
        }
        res.json(orders);
    } catch (error) {
        console.error('Lỗi khi lấy đơn hàng cho người dùng:', error); // Log lỗi
        res.status(500).json({ message: 'Có lỗi xảy ra khi lấy đơn hàng cho người dùng.', error: error.message });
    }
});  

// API tạo hóa đơn
app.post('/api/orders', async (req, res) => {
    try {
        const { user_id, fullName, phoneNumber, province, district, ward, address, note, products, total_amount, email, status } = req.body;

        if (!user_id) {
            return res.status(400).json({ error: 'user_id là bắt buộc' });
        }

        // Kiểm tra và cập nhật stock sản phẩm
        for (const product of products) {
            const { _id, quantity } = product;

            if (!_id || !mongoose.Types.ObjectId.isValid(_id)) {
                return res.status(400).json({ error: `ID sản phẩm không hợp lệ: ${_id}` });
            }

            const currentProduct = await ProductModel.findById(_id);

            if (!currentProduct) {
                return res.status(404).json({ error: `Sản phẩm không tồn tại: ${_id}` });
            }

            if (currentProduct.stock < quantity) {
                return res.status(400).json({ error: `Không đủ hàng trong kho cho sản phẩm ID ${_id}` });
            }

        }

        // Tạo đơn hàng sau khi cập nhật stock thành công
        const newOrder = new Order({
            user_id,
            fullName,
            phoneNumber,
            status,
            province,
            district,
            ward,
            address,
            note,
            products,
            total_amount
        });

        const savedOrder = await newOrder.save();

        // Gửi thông tin hóa đơn về client
        res.status(201).json({ message: 'Đặt hàng thành công!', order: savedOrder, email });

    } catch (error) {
        console.error('Lỗi khi tạo đơn hàng:', error.message);
        res.status(500).json({ error: 'Không thể tạo đơn hàng, vui lòng thử lại!' });
    }
});

// API cập nhật số lượng stock
app.patch('/api/products/:id', async (req, res) => {
    const productId = req.params.id;
    const { quantity } = req.body;

    if (!quantity || quantity <= 0) {
        return res.status(400).json({ error: 'Số lượng không hợp lệ' });
    }

    try {
        const product = await ProductModel.findById(productId);

        if (!product) {
            return res.status(404).json({ error: 'Sản phẩm không tồn tại' });
        }

        if (product.stock < quantity) {
            return res.status(400).json({ error: 'Không đủ hàng trong kho' });
        }

        // Cập nhật stock với số lượng đã đặt hàng
        product.stock -= quantity;
        await product.save();

        res.status(200).json({ message: 'Cập nhật số lượng thành công', stock: product.stock });
    } catch (error) {
        console.error('Lỗi khi cập nhật stock:', error.message);
        res.status(500).json({ error: 'Không thể cập nhật số lượng sản phẩm' });
    }
});

// API hủy đơn hàng
app.patch('/api/orders/:id/cancel', async (req, res) => {
    const orderId = req.params.id;

    try {
        const order = await Order.findById(orderId).populate('products._id'); // Lấy đơn hàng và sản phẩm liên quan

        if (!order) {
            return res.status(404).json({ error: 'Đơn hàng không tồn tại' });
        }

        if (order.status !== 'Đang chờ xác nhận') {
            return res.status(400).json({ error: 'Không thể hủy đơn hàng này' });
        }

        // Cập nhật lại stock cho từng sản phẩm trong đơn hàng
        for (const product of order.products) {
            const currentProduct = await ProductModel.findById(product._id);
            if (currentProduct) {
                currentProduct.stock += product.quantity; // Hoàn lại số lượng sản phẩm vào kho
                await currentProduct.save();
            }
        }

        // Cập nhật trạng thái đơn hàng
        order.status = 'Đơn hàng đã hủy';
        await order.save();

        res.status(200).json({ message: 'Đơn hàng đã được hủy thành công', order });
    } catch (error) {
        console.error('Lỗi khi hủy đơn hàng:', error.message);
        res.status(500).json({ error: 'Không thể hủy đơn hàng, vui lòng thử lại!' });
    }
});

// Sử dụng router cho các route liên quan đến orders
app.use('/api', router);

// API lấy tất cả đơn hàng
app.get('/api/orders', async (req, res) => {
    try {
        const orders = await Order.find();
        if (!orders || orders.length === 0) {
            return res.status(404).send('Không tìm thấy đơn hàng.');
        }
        res.json(orders);
    } catch (error) {
        console.error('Lỗi khi lấy đơn hàng:', error);
        res.status(500).send('Có lỗi xảy ra khi lấy đơn hàng');
    }
});

// API xác nhận đơn hàng
app.put('/api/orders/:id/confirm', (req, res) => {
    const orderId = req.params.id;
    // Tìm và cập nhật trạng thái của đơn hàng
    Order.findByIdAndUpdate(orderId, { status: 'Đã xác nhận' }, { new: true })
        .then(updatedOrder => res.json(updatedOrder))
        .catch(err => res.status(500).json({ message: 'Lỗi cập nhật đơn hàng', error: err }));
});

// API lấy đơn hàng theo ID người dùng
app.get('/api/user-orders', async (req, res) => {
  const userId = req.query.userId; // Lấy userId từ query parameters

  // Kiểm tra xem userId có tồn tại không
  if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
  }

  // Kiểm tra tính hợp lệ của userId
  if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'User ID không hợp lệ' });
  }

  try {
      const orders = await Order.find({ user_id: new mongoose.Types.ObjectId(userId) }); // Lấy đơn hàng cho userId
      if (!orders || orders.length === 0) {
          return res.status(404).json({ message: 'Không tìm thấy đơn hàng cho người dùng này.' });
      }
      res.json(orders);
  } catch (error) {
      console.error('Lỗi khi lấy đơn hàng cho người dùng:', error);
      res.status(500).json({ message: 'Có lỗi xảy ra khi lấy đơn hàng cho người dùng.', error: error.message });
  }
});

//API lấy sản phẩm liên quan
app.get('/api/products/related-products/:id', async (req, res) => {
    try {
      const productId = req.params.id;
  
      // Lấy sản phẩm chi tiết để lấy category_id
      const product = await ProductModel.findById(productId); // Sửa Product thành ProductModel
      if (!product) {
        return res.status(404).send('Product not found');
      }
  
      // Lấy các sản phẩm có cùng category_id
      const relatedProducts = await ProductModel.find({
        category_id: product.category_id,
        _id: { $ne: productId } // không lấy sản phẩm hiện tại
      });
  
      res.send(relatedProducts);
    } catch (error) {
      console.error('Lỗi khi lấy sản phẩm liên quan:', error);
      res.status(500).send('Server error');
    }
  });

  //API gửi feedback
app.post('/api/rate-order', async (req, res) => {
    const { orderId, productId, rating, comment, userId } = req.body;
  
    console.log('Received Rating Data:', req.body);
  
    const newRating = new Rating({
      productId,
      orderId,
      userId,
      rating,
      comment,
    });
  
    try {
      await newRating.save();
      res.status(201).json({ message: 'Đánh giá đã được lưu' });
    } catch (error) {
      console.error('Lỗi khi lưu đánh giá:', error);
      res.status(500).json({ message: 'Lỗi server' });
    }
  });
  
  // API hiển thị feedback
  app.get('/api/ratings', async (req, res) => {
    const { productId } = req.query;
    try {
      const ratings = await Rating.find({ productId })
        .populate({
          path: 'userId',
          select: 'username',
        })
        .exec();
  
      res.json(
        ratings.map((rating) => ({
          ...rating.toObject(),
          username: rating.userId?.username || 'Người dùng',
        }))
      );
    } catch (error) {
      res.status(500).json({ message: 'Lỗi khi lấy đánh giá', error: error.message });
    }
  });

module.exports = router;

// Khởi động server
app.listen(PORT, () => {
    console.log(`Server đang chạy trên http://localhost:${PORT}`);
});
