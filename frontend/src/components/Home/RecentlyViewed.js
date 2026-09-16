import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import { getProductsByIds } from '../../actions/productAction';
import { getRecentlyViewedIds } from '../../utils/recentlyViewed';
import ProductCard from './ProductCard';

/**
 * Renders nothing until there's something to show — safe to drop into any
 * page (Home, ProductDetails, etc.) without a loading flash on first visit.
 */
const RecentlyViewed = () => {
    const dispatch = useDispatch();
    const { products } = useSelector(state => state.recentlyViewed);

    useEffect(() => {
        const ids = getRecentlyViewedIds();
        if (ids.length > 0) {
            dispatch(getProductsByIds(ids));
        }
    }, [dispatch]);

    if (!products || products.length === 0) return null;

    return (
        <section className='editorial-shell mt-24'>
            <div className='mb-10 flex items-end justify-between'>
                <div>
                    <p className='eyebrow'>Your Trail</p>
                    <h2 className='heading-display mt-3 text-display'>Recently Viewed</h2>
                </div>
                <Link to='/products' className='link-reveal hidden font-sans text-sm uppercase tracking-luxe sm:block'>
                    View all
                </Link>
            </div>
            <div className='grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3'>
                {products.map(product => (
                    <ProductCard key={product._id} product={product} />
                ))}
            </div>
        </section>
    );
};

export default RecentlyViewed;
