import React, { useState } from 'react';
import './ProductGridItem.css';
import { Rating } from '@material-ui/lab';
import { Link } from 'react-router-dom';

const ProductGridItem = ({ product }) => {
    const [hovered, setHovered] = useState(false);

    const handleMouseEnter = () => {
        setHovered(true);
    };

    const handleMouseLeave = () => {
        setHovered(false);
    };

    const options = {
        size: 'large',
        value: product.ratings,
        readOnly: false,
        precision: 0.5
    };

    return (
        <Link to={`/product/${product._id}`}>
            <div
                className='productGridItem'
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                <img src={product.images[0].url} alt={product.name} />

                {hovered && (
                    <div className='productGridItemContent'>
                        <p>{product.name}</p>
                        <span>{`${product.description}`}</span>
                        <span>{`₹${product.price}`}</span>
                        <Rating {...options} />
                        <span className='productCardSpan'>
                            ({product.numOfReviews} Reviews)
                        </span>
                    </div>
                )}
            </div>
        </Link>
    );
};

export default ProductGridItem;
