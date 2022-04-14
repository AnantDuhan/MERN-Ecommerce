import React, { Fragment } from 'react';
import { useSelector } from 'react-redux';
import { Route, Routes } from 'react-router-dom';
import WebFont from 'webfontloader';
import './App.css';
import store from './store';

import { loadUser } from './actions/userAction';

import Home from './components/Home/Home';

import Footer from './components/layout/Footer/Footer';
import Header from './components/layout/Header/Header';
import UserOptions from './components/layout/Header/UserOptions';
import Loader from './components/layout/Loader/Loader';

import ProductDetails from './components/Product/ProductDetails';
import Products from './components/Product/Products';
import Search from './components/Product/Search';

import UpdateProfile from './components/User/UpdateProfile';
import UpdatePassword from './components/User/UpdatePassword';
import ForgotPassword from './components/User/ForgotPassword';
import ResetPassword from './components/User/ResetPassword';
import LoginSignup from './components/User/LoginSignup';
import Profile from './components/User/Profile';
import Cart from './components/Cart/Cart';

function App() {
    const { isAuthenticated, user } = useSelector((state) => state.user);

    React.useEffect(() => {
        WebFont.load({
            google: {
                families: ['Roboto', 'Droid Sans', 'Chilanka'],
            },
        });
        store.dispatch(loadUser());
    }, []);

    const { loading } = useSelector((state) => state.user);

    return (
        <div>
            {loading ? (
                <Loader />
            ) : (
                <Fragment>
                    <Header />
                    {isAuthenticated && <UserOptions user={user} />}
                    <Routes>
                        <Route path="/" element={<Home />} exact />
                        <Route
                            path="/product/:id"
                            element={<ProductDetails />}
                            exact
                        />
                        <Route path="/products" element={<Products />} exact />
                        <Route
                            path="/products/:keyword"
                            element={<Products />}
                            exact
                        />

                        <Route path="/search" element={<Search />} exact />

                        {isAuthenticated && (
                            <Route
                                path="/account"
                                element={<Profile />}
                                exact
                            />
                        )}

                        {isAuthenticated && (
                            <Route
                                path="/me/update"
                                element={<UpdateProfile />}
                                exact
                            />
                        )}

                        {isAuthenticated && (
                            <Route
                                path="/password/update"
                                element={<UpdatePassword />}
                                exact
                            />
                        )}

                        <Route
                            path="/password/forgot"
                            element={<ForgotPassword />}
                            exact
                        />

                        <Route
                            path="/password/reset/:token"
                            element={<ResetPassword />}
                            exact
                        />

                        <Route path="/login" element={<LoginSignup />} exact />

                        <Route path="/cart" element={<Cart />} exact />
                    </Routes>
                    <Footer />
                </Fragment>
            )}
        </div>
    );
}

export default App;
