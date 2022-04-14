const express = require('express');
const {
    processPayment,
    sendStripeApiKey,
} = require('../controllers/paymentController');
const router = express.Router();
const { isAuthUser } = require('../middleware/auth');

router.route('/payment/process').post(isAuthUser, processPayment);

router.route('/stripeapikey').get(isAuthUser, sendStripeApiKey);

module.exports = router;
