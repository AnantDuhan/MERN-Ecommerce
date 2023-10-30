import { Rating } from '@material-ui/lab';
import React, { Fragment, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { addProductToWishlist } from '../../actions/productAction';
import { toast } from 'react-toastify';

const ProductCard = ({ product }) => {

    const dispatch = useDispatch();

    const options = {
        size: 'small',
        value: product.ratings,
        readOnly: false,
        precision: 0.2
    };

    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const images = product.images;

    const addToWishlist = () => {
        toast.success('Product added to wishlist');
        dispatch(addProductToWishlist(product._id));
    }

    useEffect(() => {
        const intervalId = setInterval(() => {
            const nextIndex = (currentImageIndex + 1) % images.length;
            setCurrentImageIndex(nextIndex);
        }, 2000);

        return () => clearInterval(intervalId);
    }, [currentImageIndex, images.length]);

    return (
        <Fragment>
                <Link className='productCard' to={`/product/${product._id}`}>
                    <div className='image-container'>
                        <img
                            src={images[currentImageIndex].url}
                            alt={product.name}
                            className='product-image'
                        />
                    </div>
                    <p>{product.name}</p>
                    <div>
                        <Rating {...options} />
                        <span className='productCardSpan'>
                            ({product.numOfReviews} Reviews)
                        </span>
                    </div>
                    <span>{`₹${product.price}`}</span>
                    <button onClick={addToWishlist} className='addToWishlistButton'>
                        Add to Wishlist
                    </button>
                </Link>
        </Fragment>
    );
};

export default ProductCard;
