const Return = require('../models/return');
const Order = require('../models/order');

exports.requestReturn = async (req, res) => {
    try {
            const order = await Order.findById(req.params.id);

            if (!order) {
                return res.status(404).json({
                    success: false,
                    message: 'Order not found'
                });
            }

            if (order.orderStatus !== 'Delivered') {
                return res.status(400).json({
                    success: false,
                    message: 'Order has not been delivered yet'
                });
            }

            const productsInOrder = order.orderItems.map(item => item.product._id);

            // Create a new Return document for each product in the order
            for (const productId of productsInOrder) {
                const newReturn = new Return({
                    order: order._id,
                    product: productId,
                    reason: req.body.returnReason,
                    requestedAt: new Date(),
                    status: 'Pending'
                });

                await newReturn.save();
                order.returns.push(newReturn._id); // Push the return _id into the array
            }

            order.isReturned = true;
            order.returnReason = req.body.returnReason;
            order.returnRequestedAt = new Date();
            await order.save();

            res.status(200).json({
                success: true,
                message: 'Return requested',
                order
            });
        } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// Get all return requests
exports.getAllReturns = async (req, res) => {
    try {
        const returns = await Return.find()
            .populate({
                path: 'order',
                select: 'user returnRequestedAt',
                populate: {
                    path: 'user',
                    select: 'name email'
                }
            })
            .sort('-requestedAt');

        res.status(200).json({ success: true, returns });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
