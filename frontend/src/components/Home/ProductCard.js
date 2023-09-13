import { Rating } from '@material-ui/lab';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
    const options = {
        size: 'small',
        value: product.ratings,
        readOnly: false,
        precision: 0.2
    };

    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const images = product.images;

    useEffect(() => {
        const intervalId = setInterval(() => {
            const nextIndex = (currentImageIndex + 1) % images.length;
            setCurrentImageIndex(nextIndex);
        }, 2000);

        return () => clearInterval(intervalId);
    }, [currentImageIndex, images.length]);

    return (
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
        </Link>
    );
};

export default ProductCard;
