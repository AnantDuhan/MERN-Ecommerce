const Order = require('../models/order');
const Product = require('../models/product');
const sendEmail = require('../utils/sendEmail');
const accountSid = process.env.ACCOUNT_SID;
const authToken = process.env.AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);
const User = require('../models/user');

// create new order
exports.newOrder = async (req, res, next) => {
    const user = await User.findById(req.user._id);

    const {
        shippingInfo,
        orderItems,
        paymentInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice
    } = req.body;

    const order = await Order.create({
        shippingInfo,
        orderItems,
        paymentInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paidAt: Date.now(),
        user: req.user._id
    });

    const randomDays = Math.floor(Math.random() * 8); // Generate random number between 0 and 7
    const currentDate = new Date();
    const estimatedDeliveryDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        currentDate.getDate() + randomDays
   ); // Add random days

   const imageUrl = order.orderItems.image;

   const emailMessage = `<html>
    <body>
        <p>Hello ${user.name}!</p>
        <p>Your order📦 has been placed successfully. Your estimated Date of delivery is ${estimatedDeliveryDate.toDateString()}.</p>
        <img src="${imageUrl}" alt="Ordered Items">
        <p>Thank you for ordering. For more please visit our website <a href="http://www.orderplanning.com">www.orderplanning.com</a>.</p>
        <p>Here's the image of your ordered items:</p>
        <p>Happy Shopping.😊</p>
    </body>
    </html>`;

    // For WhatsApp, use the same message without HTML tags
    const whatsappMessage = `Hello ${user.name}!\n
Your order📦 has been placed successfully. Your estimated Date of delivery is ${estimatedDeliveryDate.toDateString()}.\n
Thank you for ordering. For more please visit our website http://www.orderplanning.com.\n
Happy Shopping.😊`;

    await client.messages.create({
        body: whatsappMessage,
        from: 'whatsapp:+14155238886',
        to: `whatsapp:+91${order.shippingInfo.phoneNumber}`,
        mediaUrl: [imageUrl]
    });

    await sendEmail({
        email: user.email,
        subject: `Your Order📦 has been placed successfully`,
        html: emailMessage
    });

    res.status(200).json({
        success: true,
        order
    });
};

// get single order
exports.getSingleOrder = async (req, res, next) => {
    const order = await Order.findById(req.params.id).populate(
        'user',
        'name email'
    );
    if (!order) {
        return res.status(404).json({
            success: false,
            message: 'Order📦 not found with this Id'
        });
    }

    res.status(200).json({
        success: true,
        order
    });
};

// get logged in user order
exports.myOrders = async (req, res, next) => {
    const orders = await Order.find({
        user: req.user._id
    });

    res.status(200).json({
        success: true,
        orders
    });
};

// get all orders --admin
exports.getAllOrders = async (req, res, next) => {
    const orders = await Order.find();

    let totalAmount = 0;

    orders.forEach(order => {
        totalAmount += order.totalPrice;
    });

    res.status(200).json({
        success: true,
        totalAmount,
        orders
    });
};

// update order status --admin
exports.updateOrder = async (req, res, next) => {
    const order = await Order.findById(req.params.id);
    const user = await User.findById(req.user._id);

    if (!order) {
        return res.status(404).json({
            success: false,
            message: 'Order📦 not found with this Id'
        });
    }

    if (order.orderStatus === 'Delivered') {
        return res.status(400).json({
            success: false,
            message: 'You have already delivered this order'
        });
    }

    if (req.body.status === 'Shipped') {
        order.orderItems.forEach(async o => {
            await updateStock(o.product, o.quantity);
        });
    }

    order.orderStatus = req.body.status;

    if (req.body.status === 'Delivered') {
        order.DeliveredAt = Date.now();
        order.estimatedDeliveryDate = null;
    }

    await order.save({ validateBeforeSave: false });

    const randomDays = Math.floor(Math.random() * 8); // Generate random number between 0 and 7
    const currentDate = new Date();
    const estimatedDeliveryDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        currentDate.getDate() + randomDays
    ); // Add random days

    const imageUrl = order.orderItems.image;

    const emailMessage = `<html>
    <body>
        <p>Hello ${user.name}!</p>
        <p>Your order📦 ${order._id} has been ${order.orderStatus}. Your estimated Date of delivery is ${estimatedDeliveryDate.toDateString()}.</p>
        <img src="${imageUrl}" alt="Ordered Items">
        <p>Thank you for ordering. For more please visit our website <a href="http://www.orderplanning.com">www.orderplanning.com</a>.</p>
        <p>Here's the image of your ordered items:</p>
        <p>Happy Shopping.😊</p>
    </body>
    </html>`;

    // For WhatsApp, use the same message without HTML tags
    const whatsappMessage = `Hello ${user.name}!\n
Your order📦 ${order._id} has been ${
        order.orderStatus
    }. Your estimated Date of delivery is ${estimatedDeliveryDate.toDateString()}.\n
Thank you for ordering. For more please visit our website http://www.orderplanning.com.\n
Happy Shopping.😊`;

    await client.messages.create({
        mediaUrl: [imageUrl],
        body: whatsappMessage,
        from: 'whatsapp:+14155238886',
        to: `whatsapp:+91${order.shippingInfo.phoneNumber}`,
    });

    await sendEmail({
        email: user.email,
        subject: `Your Order📦 Status Update: ${order.orderStatus}`,
        html: emailMessage
    });

    await sendEmail({
        email: user.email,
        subject: `Your Order📦 Status Update: ${order.orderStatus}`,
        html: message
    });

    res.status(200).json({
        success: true,
        message: 'WhatsApp & Email sent successfully',
        order
    });
};

async function updateStock(id, quantity) {
    const product = await Product.findById(id);
    product.Stock -= quantity;
    await product.save({ validateBeforeSave: false });
}

// delete Order -- Admin
exports.deleteOrder = async (req, res, next) => {
    const order = await Order.findById(req.params.id);

    if (!order) {
        return res.status(404).json({
            success: false,
            message: 'Order📦 not found with this Id'
        });
    }

    await order.remove();

    res.status(200).json({
        success: true,
        message: 'Order📦 deleted successfully'
    });
};
