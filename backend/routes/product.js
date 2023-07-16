const express = require('express');
const {
   getAllProducts,
   getAdminProducts,
   getProductDetails,
   createProductReview,
   getProductReviews,
   deleteReview
} = require('../controllers/product');

const { isAuthUser, authRoles } = require('../middleware/auth');

const router = express.Router();

router.route('/products').get(getAllProducts);

router
    .route('/admin/products')
    .get(isAuthUser, authRoles('admin'), getAdminProducts);

router.route('/product/:id').get(getProductDetails);

router.route('/review').put(isAuthUser, createProductReview);

router
    .route('/reviews')
    .get(getProductReviews)
    .delete(isAuthUser, deleteReview);

module.exports = router;
