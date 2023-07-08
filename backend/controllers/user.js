const User = require('../models/user');
const sendEmail = require('../utils/sendEmail');
const crypto = require('crypto');
const { cloudinary } = require('cloudinary').v2;
const jwt = require('jsonwebtoken');
const uuid = require('uuid').v4;
const s3 = require('../server');
const AWS = require('aws-sdk');
const { AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_BUCKET_NAME } = process.env;
const {
    S3Client,
    PutObjectCommand,
    GetObjectCommand
} = require('@aws-sdk/client-s3');
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

const generateFileName = (bytes = 32) => crypto.randomBytes(bytes).toString('hex');

// upload 
exports.postImage = async (req, res, base64) => {

    const file = req.file;
    
    // const fileBuffer = await sharp(file.buffer)
    //     .resize({ 
    //         height: 1080,
    //         width: 1920,
    //         fit: "contain"
    //     })
    //     .toBuffer()
    
    // const fileBuffer = Buffer.from(file.buffer);
    console.log("BUFFER CHECK", file.buffer)
    
    const fileName = generateFileName();
    const uploadParams = {
        Bucket: AWS_BUCKET_NAME,
        Body: fileBuffer,
        Key: fileName,
        ContentType: file.mimetype
    }

    await S3Client.send(new PutObjectCommand(uploadParams));

    const post = await prisma.posts.create({
        data: {
            imageName,
        }
    })

    res.send(post);
};

exports.getUrl = async (req, res, next) => {
    const posts = await prisma.posts.findMany({
        orderBy: [{ created: 'desc' }]
    });

    for (let post of posts) {
        post.imageUrl = await getSignedUrl(
            S3Client,
            GetObjectCommand({
                Bucket: AWS_BUCKET_NAME,
                Key: imageName
            }),
            { expiresIn: 60 }
        );
    }

    res.send(posts);
}

// Register our user
exports.registerUser = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;

        //   let user = await User.findOne({ email });

        //   if (user) {
        //       return res.status(400).json({
        //           success: false,
        //           message: 'User already registered'
        //       });
        //   }

        //   const myCloud = await cloudinary.uploader.upload(avatar, {
        //       folder: 'avatar',
        //       resource_type: 'auto',
        //       crop: "scale",
        //       width: 150
        //   });

        //   console.log('CHECK', avatar);
        //   console.log(
        //       'chala kyaaa',
        //       await cloudinary.v2.uploader.upload(req.body.avatar, {
        //           folder: 'avatar',
        //           resource_type: 'auto',
        //           crop: 'scale',
        //           width: 150
        //       })
        //   );

        // let myFile = req.file.originalname.split(".");
        // const fileType = myFile[myFile.length - 1];

        // const params = {
        //     Bucket: process.env.AWS_BUCKET_NAME,
        //     Key: `${uuid()}.${fileType}`,
        //     Body: req.file.buffer
        // };

        // s3.upload(params, (error, data) => {
        //     if (error) {
        //         res.status(500).json({
        //             success: false,
        //             error: error.message
        //         });
        //     }
        //     res.status(200).json({
        //         success: false,
        //         message: 'Image uploaded successfully'
        //     });
        // })

        // const presignedGETURL = s3.setSignedUrl('getObject', {
        //     Bucket: process.env.AWS_BUCKET_NAME,
        //     Key: `${uuid()}.${fileType}`,
        //     Expires: 1000 * 5 //time to expire in seconds
        // });

        // console.log("URL", presignedGETURL);

        const user = await User.create({
            name,
            email,
            password
            //   avatar: {
            //       public_id: myCloud.public_id,
            //       url: myCloud.secure_url
            //   }
        });

        let token = jwt.sign(
            {
                id: user._id,
                name: user.name,
                email: user.email,
                avatar: user.avatar
            },
            process.env.JWT_SECRET_KEY
        );

        const options = {
            expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
            httpOnly: true
        };

        res.status(201).cookie('token', token, options).json({
            success: true,
            user
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

// Login User
exports.loginUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // checking if user has given email and password both
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please Enter Email and Password'
            });
        }

        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid Email or Password'
            });
        }

        const isPasswordMatched = await user.comparePassword(password);
        if (!isPasswordMatched) {
            return res.status(401).json({
                success: false,
                message: 'Invalid Email or Password'
            });
        }

        let token = jwt.sign(
            {
                id: user._id,
                name: user.name,
                email: user.email,
                avatar: user.avatar
            },
            process.env.JWT_SECRET_KEY
        );

        const options = {
            expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
            httpOnly: true
        };

        res.status(201).cookie('token', token, options).json({
            success: true,
            // message: 'OTP sent to your mail, please verify!',
            user
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

// logout User
exports.logout = async (req, res, next) => {
    res.cookie('token', null, {
        expires: new Date(Date.now()),
        httpOnly: true
    });

    res.status(200).json({
        success: true,
        message: 'User logged out'
    });
};

// forgot password
exports.forgotPassword = async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
        return res.status(404).json({
            success: false,
            message: 'User not found'
        });
    }

    // get reset password token
    const resetToken = user.getResetPasswordToken();

    await user.save({ validateBeforeSave: false });

    const resetPasswordURL = `${process.env.FRONTEND_URL}/password/reset/${resetToken}`;

    try {
        await sendEmail({
            email: user.email,
            subject: `Password Recovery - Ecommerce`,
            html: `Your password reset token is:- \n\n ${resetPasswordURL} \n\n If you have not requested this email then, please ignore it.`
        });

        res.status(200).json({
            success: true,
            message: `Email sent to ${user.email} successfully.`
        });
    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save({ validateBeforeSave: false });

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// reset password
exports.resetPassword = async (req, res, next) => {
    // creating token hash
    const resetPasswordToken = crypto
        .createHash('sha256')
        .update(req.params.token)
        .digest('hex');

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
        return res.status(400).json({
            success: false,
            message: 'Reset Password Token in invalid or has been expired!'
        });
    }

    if (req.body.password !== req.body.confirmPassword) {
        return res.status(400).json({
            success: false,
            message: 'Password does not match!'
        });
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    let token = jwt.sign(
        {
            id: user._id,
            name: user.name,
            email: user.email,
            avatar: user.avatar
        },
        process.env.JWT_SECRET_KEY
    );

    const options = {
        expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        httpOnly: true
    };

    res.status(200).cookie('token', token, options).json({
        success: true,
        user
    });
};

// get User details
exports.getUserDetails = async (req, res, next) => {
    const user = await User.findById(req.user.id);
    res.status(200).json({
        success: true,
        user
    });
};

// update User password
exports.updatePassword = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id).select('+password');

        const isPasswordMatched = await user.comparePassword(
            req.body.oldPassword
        );

        if (!isPasswordMatched) {
            return res.status(400).json({
                success: false,
                message: 'Old Password is incorrect'
            });
        }

        if (req.body.newPassword !== req.body.confirmPassword) {
            return res.status(400).json({
                success: false,
                message: 'Password does not match'
            });
        }

        user.password = req.body.newPassword;

        await user.save();

        let token = jwt.sign(
            {
                id: user._id,
                name: user.name,
                email: user.email,
                avatar: user.avatar
            },
            process.env.JWT_SECRET_KEY
        );

        const options = {
            expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
            httpOnly: true
        };

        res.status(200).cookie('token', token, options).json({
            success: true,
            user
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

// update User Profile
exports.updateProfile = async (req, res, next) => {
    const newUserData = {
        name: req.body.name,
        email: req.body.email
    };

    if (req.body.avatar !== '') {
        const user = await User.findById(req.user.id);

        const imageId = user.avatar.public_id;

        await cloudinary?.v2.uploader.destroy(imageId);

        const myCloud = await cloudinary?.v2.uploader.upload(req.body.avatar, {
            folder: 'avatars'
        });
        newUserData.avatar = {
            public_id: myCloud.public_id,
            url: myCloud.secure_url
        };
    }

    const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    });

    res.status(200).json({
        success: true,
        user
    });
};

// get all users --admin
exports.getAllUsers = async (req, res, next) => {
    const users = await User.find();

    res.status(200).json({
        success: true,
        users
    });
};

// get single user --admin
exports.getSingleUser = async (req, res, next) => {
    const user = await User.findById(req.params.id);

    if (!user) {
        return res.status(400).json({
            success: false,
            message: `User does not exist with Id: ${req.params.id}`
        });
    }

    res.status(200).json({
        success: true,
        user
    });
};

// update User Role --admin
exports.updateUserRole = async (req, res, next) => {
    const newUserData = {
        name: req.body.name,
        email: req.body.email,
        role: req.body.role
    };

    const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    });

    res.status(200).json({
        success: true,
        user
    });
};

// delete User --admin
exports.deleteUser = async (req, res, next) => {
    const user = await User.findById(req.params.id);

    if (!user) {
        return res.status(400).json({
            success: false,
            message: `User does not exist with Id: ${req.params.id}`
        });
    }

    const imageId = user.user.avatar.public_id;

    await cloudinary?.v2.uploader.destroy(imageId);
    // await cloudinary.uploader.destroy(imageId);

    await user.remove();

    res.status(200).json({
        success: true,
        message: 'User deleted successfully!'
    });
};
