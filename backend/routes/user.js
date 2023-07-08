const express = require('express');
const {
   registerUser,
   loginUser,
   logout,
   forgotPassword,
   resetPassword,
   getUserDetails,
   updatePassword,
   updateProfile,
   getAllUsers,
   getSingleUser,
   updateUserRole,
   deleteUser,
   postImage,
   getUrl
} = require('../controllers/user');
const multer = require('multer');
const storage = multer.memoryStorage({
    destination: function (req, file, callback) {
        callback(null, '');
    }
});
const upload = multer({ storage });
const { isAuthUser, authRoles } = require('../middleware/auth');

const router = express.Router();

router.route('/post-image').post(upload.single('image'), postImage);

router.route('/getUrl').get(getUrl);

router.route('/register').post(upload.single('image'), registerUser);

router.route('/login').post(loginUser);

router.route('/password/forgot').post(forgotPassword);

router.route('/password/reset/:token').put(resetPassword);

router.route('/logout').get(logout);

router.route('/me').get(isAuthUser, getUserDetails);

router.route('/password/update').put(isAuthUser, updatePassword);

router
    .route('/me/update')
    .put(isAuthUser, upload.single('image'), updateProfile);

router.route('/admin/users').get(isAuthUser, authRoles('admin'), getAllUsers);

router
    .route('/admin/user/:id')
    .get(isAuthUser, authRoles('admin'), getSingleUser)
    .put(isAuthUser, authRoles('admin'), updateUserRole)
    .delete(isAuthUser, authRoles('admin'), deleteUser);

module.exports = router;
