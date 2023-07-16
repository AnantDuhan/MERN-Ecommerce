const express = require('express');
const {
   loginUser,
   logout,
   forgotPassword,
   resetPassword,
   getUserDetails,
   updatePassword,
   getAllUsers,
   getSingleUser,
   updateUserRole,
} = require('../controllers/user');

const { isAuthUser, authRoles } = require('../middleware/auth');

const router = express.Router();

router.route('/login').post(loginUser);

router.route('/password/forgot').post(forgotPassword);

router.route('/password/reset/:token').put(resetPassword);

router.route('/logout').get(logout);

router.route('/me').get(isAuthUser, getUserDetails);

router.route('/password/update').put(isAuthUser, updatePassword);

router.route('/admin/users').get(isAuthUser, authRoles('admin'), getAllUsers);

router
    .route('/admin/user/:id')
    .get(isAuthUser, authRoles('admin'), getSingleUser)
    .put(isAuthUser, authRoles('admin'), updateUserRole);

module.exports = router;
