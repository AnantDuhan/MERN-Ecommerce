import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@material-ui/core';
import { Rating } from '@material-ui/lab';
import React, { Fragment, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

import { addItemsToCart } from '../../actions/cartAction';
import { clearErrors, getProductDetails, newReview } from '../../actions/productAction';
import { NEW_REVIEW_RESET } from '../../constants/productConstants';
import Loader from '../layout/Loader/Loader';
import MetaData from '../layout/MetaData';
import ReviewCard from './ReviewCard';

import './ProductDetails.css';

const ProductDetails = () => {
    const dispatch = useDispatch();
    const { id } = useParams();

    const { product, loading, error } = useSelector(
        state => state.productDetails
    );

    const { success, error: reviewError } = useSelector(
        state => state.newReview
    );

    const options = {
        size: 'large',
        value: product?.ratings,
        readOnly: false,
        precision: 0.2
    };

    const [quantity, setQuantity] = useState(1);
    const [open, setOpen] = useState(false);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');

    const increaseQuantity = () => {
        if (product.Stock <= quantity) return;

        const qty = quantity + 1;
        setQuantity(qty);
    };

    const decreaseQuantity = () => {
        if (1 >= quantity) return;

        const qty = quantity - 1;
        setQuantity(qty);
    };

    const addToCartHandler = () => {
        dispatch(addItemsToCart(id, quantity));
        toast.success('Item Added To Cart');
    };

    const submitReviewToggle = () => {
        open ? setOpen(false) : setOpen(true);
    };

    const reviewSubmitHandler = () => {
        const myForm = new FormData();

        myForm.set('rating', rating);
        myForm.set('comment', comment);
        myForm.set('productId', id);

        dispatch(newReview(myForm));

        setOpen(false);
    };

    useEffect(() => {
        if (error) {
            toast.error(error);
            dispatch(clearErrors());
        }

        if (reviewError) {
            toast.error(reviewError);
            dispatch(clearErrors());
        }

        if (success) {
            toast.success('Review Added Successfully');
            dispatch({ type: NEW_REVIEW_RESET });
        }
        dispatch(getProductDetails(id));
    }, [dispatch, id, error, reviewError, success]);

    return (
        <Fragment>
            {loading ? (
                <Loader />
            ) : (
                <Fragment>
                    <MetaData title={`${product.name} -- ECOMMERCE`} />
                    <div className='ProductDetails'>
                        <div>
                            {product.images &&
                                product.images.map((item, i) => (
                                    <img
                                        className='CarouselImage'
                                        key={i}
                                        src={item.url}
                                        alt={`${i} Slide`}
                                    />
                                ))
                            }
                        </div>

                        <div>
                            <div className='detailsBlock-1'>
                                <h2>{product.name}</h2>
                                <p>Product # {product._id}</p>
                            </div>
                            <div className='detailsBlock-2'>
                                <Rating {...options} />
                                <span className='detailsBlock-2-span'>
                                    {' '}
                                    ({product.numOfReviews} Reviews)
                                </span>
                            </div>
                            <div className='detailsBlock-3'>
                                <h1>{`₹${product.price}`}</h1>
                                <div className='detailsBlock-3-1'>
                                    <div className='detailsBlock-3-1-1'>
                                        <button onClick={decreaseQuantity}>
                                            -
                                        </button>
                                        <input
                                            readOnly
                                            type='number'
                                            value={quantity}
                                        />
                                        <button onClick={increaseQuantity}>
                                            +
                                        </button>
                                    </div>
                                    <button
                                        disabled={
                                            product.Stock < 1 ? true : false
                                        }
                                        onClick={addToCartHandler}
                                        className='submitReview'
                                    >
                                        Add to Cart
                                    </button>
                                </div>

                                <p>
                                    Status: {' '}
                                    <b
                                        className={
                                            product.Stock < 1
                                                ? 'redColor'
                                                : 'greenColor'
                                        }
                                    >
                                        {product.Stock < 1
                                            ? 'Out Of Stock'
                                            : 'In Stock'}
                                    </b>
                                </p>
                            </div>

                            <div className='detailsBlock-4'>
                                Description : <p>{product.description}</p>
                            </div>

                            <button
                                onClick={submitReviewToggle}
                                className='submitReview'
                            >
                                Submit Review
                            </button>
                        </div>
                    </div>

                    <h3 className='reviewsHeading'>REVIEWS</h3>

                    <Dialog
                        aria-labelledby='simple-dialog-title'
                        open={open}
                        onClose={submitReviewToggle}
                    >
                        <DialogTitle>Submit Review</DialogTitle>
                        <DialogContent className='submitDialog'>
                            <Rating
                                onChange={e => setRating(e.target.value)}
                                value={rating}
                                size='large'
                                precision='0.2'
                            />

                            <textarea
                                className='submitDialogTextArea'
                                cols='30'
                                rows='5'
                                value={comment}
                                onChange={e => setComment(e.target.value)}
                            ></textarea>
                        </DialogContent>
                        <DialogActions>
                            <Button
                                onClick={submitReviewToggle}
                                color='secondary'
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={reviewSubmitHandler}
                                color='primary'
                            >
                                Submit
                            </Button>
                        </DialogActions>
                    </Dialog>

                    {product.reviews && product.reviews[0] ? (
                        <div className='reviews'>
                            {product.reviews &&
                                product.reviews.map(review => (
                                    <ReviewCard
                                        key={review._id}
                                        review={review}
                                    />
                                ))
                            }
                        </div>
                    ) : (
                        <p className='noReviews'>No Reviews Yet</p>
                    )}
                </Fragment>
            )}
        </Fragment>
    );
};

export default ProductDetails;
