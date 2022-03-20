const ErrorHandler = require('../utils/errorhandler');
const catchAsyncErrors = require('./catchAsyncErrors');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

exports.isAuthUser = catchAsyncErrors(async (req, res, next) => {
   const { token } = req.cookies;
   if (!token) {
      return next(
         new ErrorHandler('Please Login to access this resource', 401)
      );
   }
   const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);

   req.user = await User.findById(decodedToken.id);

   next();
});

exports.authRoles = (...roles) => {
   return (req, res, next) => {
      if (!roles.includes(req.user.role)) {
         return next(
            new ErrorHandler(
               `Role: ${req.user.role} is not allowed to access the resource`,
               403
            )
         );
      }
      next();
   };
};
