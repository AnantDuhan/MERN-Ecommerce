import { Rating } from '@material-ui/lab';
import React, { Fragment, useEffect, useState } from 'react';
import { useAlert } from 'react-alert';
import Carousel from 'react-material-ui-carousel';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import { clearErrors, getProductDetails } from '../../actions/productAction';
import Loader from '../layout/Loader/Loader';
import ReviewCard from './ReviewCard';

import './ProductDetails.css';
import MetaData from '../layout/MetaData';
import { addItemsToCart } from '../../actions/cartAction'

const ProductDetails = () => {
    const dispatch = useDispatch();
    const { id } = useParams();
    const alert = useAlert();

    const { product, loading, error } = useSelector(
        (state) => state.productDetails
    );

    useEffect(() => {
        if (error) {
            alert.error(error);
            dispatch(clearErrors());
        }
        dispatch(getProductDetails(id));
    }, [dispatch, id, error, alert]);

    const options = {
        value: product.ratings,
        readOnly: true,
        precision: 0.5,
    };

    const [quantity, setQuantity] = useState(1);

    const increaseQuantity = () => {

        if (product.stock <= quantity)
            return;

        const qty = quantity + 1;
        setQuantity(qty);
    };

    const decreaseQuantity = () => {
        if (1 >= quantity)
            return;

        const qty = quantity - 1;
        setQuantity(qty);
    };

    const addToCartHandler = () => {
        dispatch(addItemsToCart(id, quantity));
        alert.success("Items Added To Cart.");
    }

    return (
        <Fragment>
            {loading ? (
                <Loader />
            ) : (
                <Fragment>
                    <MetaData title={`${product.name} -- ECOMMERCE`} />
                    <div className="ProductDetails">
                        <div>
                            <Carousel>
                                {product.images &&
                                    product.images.map((item, i) => (
                                        <img
                                            className="CarouselImage"
                                            key={i}
                                            src={item.url}
                                            alt={`${i} Slide`}
                                        />
                                    ))
                                }
                            </Carousel>
                        </div>

                        <div>
                            <div className="detailsBlock-1">
                                <h2>{product.name}</h2>
                                <p>Product # {product._id}</p>
                            </div>
                            <div className="detailsBlock-2">
                                <Rating {...options} />
                                <span>({product.numOfReviews} Reviews)</span>
                            </div>
                            <div className="detailsBlock-3">
                                <h1>{`₹${product.price}`}</h1>
                                <div className="detailsBlock-3-1">
                                    <div className="detailsBlock-3-1-1">
                                        <button onClick={decreaseQuantity}>
                                            -
                                        </button>
                                        <input
                                            readOnly
                                            value={quantity}
                                            type="number"
                                        />
                                        <button onClick={increaseQuantity}>
                                            +
                                        </button>
                                    </div>
                                        <button
                                            disabled={product.Stock < 1 ? true : false}
                                            onClick={addToCartHandler}>
                                        Add to Cart
                                    </button>
                                </div>
                                <p>
                                    Status:{' '}
                                    <b
                                        className={
                                            product.Stock < 1
                                                ? 'redColor'
                                                : 'greenColor'
                                        }
                                    >
                                        {product.Stock < 1
                                            ? 'OutOfStock'
                                            : 'InStock'}
                                    </b>
                                </p>
                            </div>

                            <div className="detailsBlock-4">
                                Description: <p>{product.description}</p>
                            </div>
                            <button className="submitReview">
                                Submit Review
                            </button>
                        </div>
                    </div>

                    <h3 className="reviewsHeading">REVIEWS</h3>
                    {product.reviews && product.reviews[0] ? (
                        <div className="reviews">
                            {product.reviews &&
                                product.reviews.map((review) => (
                                    <ReviewCard review={review} />
                                ))}
                        </div>
                    ) : (
                        <p className="noReview">No Reviews yet</p>
                    )}
                </Fragment>
            )}
        </Fragment>
    );
};

export default ProductDetails;
