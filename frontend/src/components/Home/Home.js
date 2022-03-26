import React, { Fragment, useEffect } from 'react';
import { useAlert } from 'react-alert';
import { CgMouse } from 'react-icons/all';
import { useDispatch, useSelector } from 'react-redux';

import { clearErrors, getProduct } from '../../actions/productAction';
import Loader from '../layout/Loader/Loader';
import MetaData from '../layout/MetaData';
import Product from './ProductCard';

import './Home.css';

const Home = () => {
    const alert = useAlert();
    const dispatch = useDispatch();
    const { loading, error, products } = useSelector((state) => state.products);

    useEffect(() => {
        if (error) {
            alert.error(error);
            dispatch(clearErrors());
        }
        dispatch(getProduct());
    }, [dispatch, error, alert]);

    return (
        <Fragment>
            {loading ? (
                <Loader />
            ) : (
                <Fragment>
                    <MetaData title="ECOMMERCE" />

                    <div className="banner">
                        <p>Welcome to Ecommerce</p>
                        <h1>FIND AMAZING PRODUCTS BELOW</h1>

                        <a href="#container">
                            <button>
                                Scroll <CgMouse />
                            </button>
                        </a>
                    </div>

                    <h2 className="homeHeading">Featured Products</h2>

                    <div className="container" id="container">
                        {products &&
                            products.map((product) => (
                                <Product
                                    key={product._id}
                                    product={product}
                                />
                            ))}
                    </div>
                </Fragment>
            )}
        </Fragment>
    );
};

export default Home;
