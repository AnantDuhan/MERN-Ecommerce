const Order = require('../models/order');
const Product = require('../models/product');

// create new order
exports.newOrder = async (req, res, next) => {
   const {
      shippingInfo,
      orderItems,
      paymentInfo,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
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
      user: req.user._id,
   });

   res.status(200).json({
      success: true,
      order,
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
          message: 'Order not found with this Id'
      });
   }


   res.status(200).json({
      success: true,
      order,
   });
};

// get logged in user order
exports.myOrders = async (req, res, next) => {
   const orders = await Order.find({
      user: req.user._id,
   });

   res.status(200).json({
      success: true,
      orders,
   });
};

// get all orders --admin
exports.getAllOrders = async (req, res, next) => {
   const orders = await Order.find();

   let totalAmount = 0;

   orders.forEach((order) => {
      totalAmount += order.totalPrice;
   });

   res.status(200).json({
      success: true,
      totalAmount,
      orders,
   });
};

// update order status --admin
exports.updateOrder = async (req, res, next) => {
   const order = await Order.findById(req.params.id);

   if (!order) {
      return res.status(404).json({
          success: false,
          message: 'Order not found with this Id'
      });
   }

   if (order.orderStatus === 'Delivered') {
      return res.status(400).json({
          success: false,
          message: 'You have already delivered this order'
      });
   }

   if (req.body.status === 'Shipped') {
      order.orderItems.forEach(async (o) => {
         await updateStock(o.product, o.quantity);
      });
   }
   order.orderStatus = req.body.status;

   if (req.body.status === 'Delivered') {
      order.deliveredAt = Date.now();
   }

   await order.save({ validateBeforeSave: false });
   res.status(200).json({
      success: true,
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
         message: 'Order not found with this Id'
     });
  }

  await order.remove();

  res.status(200).json({
     success: true,
     message: 'Order deleted successfully'
  });
};
