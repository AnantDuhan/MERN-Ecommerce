const cookieParser = require('cookie-parser');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const path = require('path');
const cors = require('cors');
const errorMiddleware = require('./middleware/error');
const dotenv = require('dotenv');

app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(fileUpload());

// config
dotenv.config({ path: 'backend/config/config.env' });

// Route Imports
const productRoute = require('./routes/product');
const userRoute = require('./routes/user');
const orderRoute = require('./routes/order');
const paymentRoute = require('./routes/payment');


app.use('/api/v1', productRoute);
app.use('/api/v1', userRoute);
app.use('/api/v1', orderRoute);
app.use('/api/v1', paymentRoute);


// CORS
app.use(async (req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Methods', '*');
    return next();
});

// middleware for error
app.use(errorMiddleware);

module.exports = app;