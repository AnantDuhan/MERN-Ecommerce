const express = require('express');
const {
   registerUser,
   loginUser,
   logout,
   forgotPassword,
   resetPassword,
   getUserDetails,
   updatePassword,
   getAllUsers,
   getSingleUser,
   updateUserRole,
   googleLogin,
   sendLoginOtp,
   verifyLoginOtp,
   setupTwoFactorAuth,
   verifyTwoFactorAuth,
   disableTwoFactorAuth,
   validateTfaToken,
} = require('../controllers/user');

const { isAuthUser, authRoles } = require('../middleware/auth');
// const upload = require('../app');
const multer = require('multer');
// const { contactUs } = require('../controllers/contact');
const { subscriber } = require('../controllers/subscribe');

// Configure Multer for file uploads
const upload = multer({
    storage: multer.memoryStorage(),
    fileFilter: (req, file, cb) => {
        if (
            file.mimetype === 'image/png' ||
            file.mimetype === 'image/jpg' ||
            file.mimetype === 'image/jpeg'
        ) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type.'));
        }
    }
});

const router = express.Router();

router.route('/auth/register').post(upload.single('image'), registerUser);

router.route('/auth/login').post(loginUser);

router.route('/auth/forgot-password').post(forgotPassword);

router.route('/auth/reset-password/:token').put(resetPassword);

router.route('/auth/logout').post(logout);

router.route('/auth/me').get(isAuthUser, getUserDetails);

router.route('/auth/password/update').put(isAuthUser, updatePassword);

router.route('/auth/admin/users').get(isAuthUser, authRoles('admin'), getAllUsers);

router
    .route('/auth/admin/user/:id')
    .get(isAuthUser, authRoles('admin'), getSingleUser)
    .put(isAuthUser, authRoles('admin'), updateUserRole);

// router.route('/contact-us').post(contactUs);

router.route('/auth/subscribe').post(subscriber);

router.route('/auth/google-login').post(googleLogin);

module.exports = router;
