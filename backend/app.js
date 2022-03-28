const cookieParser = require('cookie-parser');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const path = require('path');
const errorMiddleware = require('./middleware/error');

app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileUpload());

// Route Imports
const productRoute = require('./routes/product');
const userRoute = require('./routes/user');
const orderRoute = require('./routes/order');

app.use('/api/v1', productRoute);
app.use('/api/v1', userRoute);
app.use('/api/v1', orderRoute);

// app.use(async (ctx, next) => {
//     ctx.response.headers.set('Access-Control-Allow-Origin', '*');
//     ctx.response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
//     ctx.response.headers.set('Access-Control-Allow-Headers', 'Content-Type');
//     await next();
// });

// middleware for error
app.use(errorMiddleware);

module.exports = app;