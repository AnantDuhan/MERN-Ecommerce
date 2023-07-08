const express = require('express');
const {
   getAllProducts,
   getAdminProducts,
   createProduct,
   updateProduct,
   deleteProduct,
   getProductDetails,
   createProductReview,
   getProductReviews,
   deleteReview,
} = require('../controllers/product');
const multer = require('multer');
const storage = multer.memoryStorage({
    destination: function (req, file, callback) {
        callback(null, '');
    }
});
const upload = multer({ storage }).single('image');
const { isAuthUser, authRoles } = require('../middleware/auth');

const router = express.Router();

router.route('/products').get(getAllProducts);

router
    .route('/admin/products')
    .get(isAuthUser, authRoles('admin'), getAdminProducts);

router
   .route('/admin/add-product')
   .post(isAuthUser, authRoles('admin'), upload, createProduct);

router.route('/admin/product/:id').put(isAuthUser, authRoles('admin'), upload, updateProduct);

router
   .route('/admin/product/:id')
   .delete(isAuthUser, authRoles('admin'), deleteProduct);

router.route('/product/:id').get(getProductDetails);

router.route('/review').put(isAuthUser, createProductReview);

router
    .route('/reviews')
    .get(getProductReviews)
    .delete(isAuthUser, deleteReview);

module.exports = router;
