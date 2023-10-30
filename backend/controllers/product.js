const Product = require('../models/product');
const User = require('../models/user');
const ApiFeatures = require('../utils/apifeatures');

// get all products
exports.getAllProducts = async (req, res, next) => {
    const resultPerPage = process.env.RESULT_PER_PAGE;
    const productsCount = await Product.countDocuments();

    const apiFeature = new ApiFeatures(Product.find(), req.query)
        .search()
        .filter();

    let products = await apiFeature.query;

    let filteredProductsCount = products.length;

    apiFeature.pagination(resultPerPage);

    products = await apiFeature.query.clone();

    res.status(200).json({
        success: true,
        products,
        productsCount,
        resultPerPage,
        filteredProductsCount
    });
};

// Get All Product (Admin)
exports.getAdminProducts = async (req, res, next) => {
    const products = await Product.find();

    res.status(200).json({
        success: true,
        products
    });
};

// get product details
exports.getProductDetails = async (req, res, next) => {
    const product = await Product.findById(req.params.id);

    if (!product) {
        res.status(404).json({
            success: false,
            message: 'Product not found'
        })
    }

    res.status(200).json({
        success: true,
        product
    });
};

// create new review or update the review
exports.createProductReview = async (req, res, next) => {
    const { rating, comment, productId } = req.body;
    const review = {
        user: req.user._id,
        name: req.user.name,
        rating: Number(rating),
        comment
    };

    const product = await Product.findById(productId);
    const isReviewed = product.reviews.find(
        rev => rev.user.toString() === req.user._id.toString()
    );

    console.log(product.reviews)
    if (isReviewed) {
        product.reviews.forEach(rev => {
            if (rev.user.toString() === req.user._id.toString())
                (rev.rating = rating), (rev.comment = comment);
        });
    } else {
        product.reviews.push(review);
        product.numOfReviews = product.reviews.length;
    }

    let avg = 0;

    product.reviews.forEach(rev => {
        avg += rev.rating;
    });

    product.ratings = avg / product.reviews.length;

    await product.save({ validateBeforeSave: false });

    res.status(200).json({
        success: true,
        review
    });
};

exports.getAllWishlistProducts = async (req, res) => {
    try {
        // Find the current user
        const user = await User.findById(req.user._id).populate(
            'wishlist.product'
        );

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Extract wishlist products from the user object
        const wishlistProducts = user.wishlist.map(item => item.product);

        res.status(200).json({
            success: true,
            wishlistProducts
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        });
    }
};

exports.addToWishList = async (req, res) => {
    try {

        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        const user = await User.findById(req.user._id);

        const isProductInWishlist = user.wishlist.some(
            item => item.product.toString() === req.params.id
        );
        if (isProductInWishlist) {
            return res.status(400).json({
                success: false,
                message: 'Product is already in the wishlist'
            });
        }

        const wishlistItem = {
            product: req.params.id,
            name: product.name,
            description: product.description,
            price: product.price,
            ratings: product.ratings,
            images: product.images,
        };

        user.wishlist.push(wishlistItem);

        await user.save();

        res.status(200).json({
            success: true,
            message: 'Product added to wishlist successfully',
            wishlist: user.wishlist
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        });
    }
};

exports.removeFromWishList = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        const user = await User.findById(req.user._id);

        const isProductInWishlistIndex = user.wishlist.findIndex(
            item => item.product.toString() === req.params.id
        );

        if (isProductInWishlistIndex === -1) {
            return res.status(400).json({
                success: false,
                message: 'Product is not in the wishlist'
            });
        }

        user.wishlist.splice(isProductInWishlistIndex, 1);

        await user.save();

        res.status(200).json({
            success: true,
            message: 'Product removed from wishlist successfully',
            wishlist: user.wishlist
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        });
    }
};

// Get all reviews of a product
exports.getProductReviews = async (req, res, next) => {
    const product = await Product.findById(req.query.id);

    if (!product) {
        res.status(404).json({
            success: false,
            message: 'Product not found'
        });
    }

    res.status(200).json({
        success: true,
        reviews: product.reviews
    });
};

exports.deleteReview = async (req, res, next) => {
    const product = await Product.findById(req.query.productId);

    if (!product) {
        res.status(404).json({
            success: false,
            message: 'Product not found'
        });
    }

    const reviews = product.reviews.filter(
        rev => rev._id.toString() !== req.query.id.toString()
    );

    let avg = 0;

    reviews.forEach(rev => {
        avg += rev.rating;
    });

    let ratings = 0;

    if (reviews.length === 0) {
        ratings = 0;
    } else {
        ratings = avg / reviews.length;
    }

    const numOfReviews = reviews.length;

    await Product.findByIdAndUpdate(
        req.query.productId,
        {
            reviews,
            ratings,
            numOfReviews
        },
        {
            new: true,
            runValidators: true,
            useFindAndModify: false
        }
    );

    res.status(200).json({
        success: true
    });
};
