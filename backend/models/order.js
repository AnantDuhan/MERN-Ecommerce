const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    shippingInfo: {
        address: {
            type: String,
            required: true
        },
        city: {
            type: String,
            required: true
        },
        state: {
            type: String,
            required: true
        },
        country: {
            type: String,
            required: true
        },
        pinCode: {
            type: Number,
            required: true
        },
        phoneNumber: {
            type: Number,
            required: true
        }
    },
    orderItems: [
        {
            name: {
                type: String,
                required: true
            },
            price: {
                type: Number,
                required: true
            },
            quantity: {
                type: Number,
                required: true
            },
            image: {
                type: String,
                required: true
            },
            product: {
                type: mongoose.Schema.ObjectId,
                ref: 'Product',
                required: true
            }
        }
    ],
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    paymentInfo: {
        id: {
            type: String,
            required: true
        },
        status: {
            type: String,
            required: true
        }
    },
    paidAt: {
        type: Date,
        required: true
    },
    itemsPrice: {
        type: Number,
        default: 0,
        required: true
    },
    taxPrice: {
        type: Number,
        default: 0,
        required: true
    },
    shippingPrice: {
        type: Number,
        default: 0,
        required: true
    },
    totalPrice: {
        type: Number,
        default: 0,
        required: true
    },
    orderStatus: {
        type: String,
        required: true,
        default: 'Processing'
    },
    DeliveredAt: Date,
    createdAt: {
        type: Date,
        default: Date.now
    },
    // refund details
    isReturned: {
        type: Boolean,
        default: false
    },
    returnReason: {
        type: String
    },
    returnRequestedAt: {
        type: Date
    },
    isRefunded: {
        type: Boolean,
        default: false
    },
    refundAmount: {
        type: Number,
        default: 0
    },
    refundRequestedAt: {
        type: Date
    },
    refundedAt: {
        type: Date
    },
    refundStatus: {
        type: String
    },
    refundInfo: {
        id: String,
        amount: Number,
        status: String,
        createdAt: Date
    },
    // Coupon details
    couponUsed: {
        type: Boolean,
        default: false
    },
    couponCode: {
        type: String
    },
    discountedAmount: {
        type: Number,
        default: 0
    }
});

module.exports = mongoose.model('Order', orderSchema);
