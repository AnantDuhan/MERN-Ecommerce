const express = require('express');
const router = express.Router();
const { isAuthUser, authRoles } = require('../middleware/auth');
const {
    createSubscription,
    getAllSubscriptions,
    getSubscriptionById,
    updateSubscriptionById,
    deleteSubscription,
    cancelSubscription,
    plusSubscription_monthly,
    plusSubscription_every3months,
    plusSubscription_yearly,
    allPrices
} = require('../controllers/plusMembership');

router.route('/prices/all').get(isAuthUser, allPrices);

router.route(
    '/admin/subscriptions').post(
    isAuthUser,
    authRoles('admin'),
    createSubscription
);

router
    .route('/admin/create-subscription')
    .post(isAuthUser, authRoles('admin'), createSubscription);

router
    .route('/admin/subscriptions')
    .get(isAuthUser, authRoles('admin'), getAllSubscriptions);

router
    .route('/admin/subscription/:id')
    .get(isAuthUser, authRoles('admin'), getSubscriptionById)
    .put(isAuthUser, authRoles('admin'), updateSubscriptionById)
    .delete (isAuthUser, authRoles('admin'), deleteSubscription);

router
    .route('/admin/subscription/:id/cancel')
    .put(isAuthUser, authRoles('admin'), cancelSubscription);

router
    .route('/join/platinum-membership/monthly')
    .post(isAuthUser, plusSubscription_monthly);

router
    .route('/join/platinum-membership/3-months')
    .post(isAuthUser, plusSubscription_every3months);

router
    .route('/join/platinum-membership/yearly')
    .post(isAuthUser, plusSubscription_yearly);

module.exports = router;
