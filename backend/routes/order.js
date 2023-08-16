const express = require('express');
const {
   newOrder,
   getSingleOrder,
   myOrders,
   getAllOrders,
   updateOrder,
   deleteOrder,
   requestReturn,
   updateRefundStatus,
   initiateRefund,
   getAllReturns,
   getAllRefunds,
} = require('../controllers/order');
const router = express.Router();

const { isAuthUser, authRoles } = require('../middleware/auth');

router.route('/order/new').post(isAuthUser, newOrder);

router.route('/order/:id').get(isAuthUser, getSingleOrder);

router.route('/orders/me').get(isAuthUser, myOrders);

router.route('/admin/orders').get(isAuthUser, authRoles('admin'), getAllOrders);

router
    .route('/admin/order/:id')
    .put(isAuthUser, authRoles('admin'), updateOrder)
    .delete(isAuthUser, authRoles('admin'), deleteOrder);

router.route('/order/:id/return').post(isAuthUser, requestReturn);

router.route('/admin/refund/:id/status').patch(isAuthUser, authRoles('admin'),updateRefundStatus);

router.route('/order/:id/refund').post(isAuthUser, initiateRefund);

// Get all return requests
router.get('/admin/returns', isAuthUser, authRoles('admin'), getAllReturns);

// Get all refund requests
router.get('/admin/refunds', isAuthUser, authRoles('admin'), getAllRefunds);

module.exports = router;
