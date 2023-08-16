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

router.route('/order/:id/refund').post(isAuthUser, initiateRefund);

router.route('/admin/refund/:id/status').patch(isAuthUser, authRoles('admin'), updateRefundStatus);

router.route('/admin/returns').get(isAuthUser, authRoles('admin'), getAllReturns);

router.route('/admin/refunds').get(isAuthUser, authRoles('admin'), getAllRefunds);

module.exports = router;
