import LockOpenIcon from '@material-ui/icons/LockOpen';
import MailOutlineIcon from '@material-ui/icons/MailOutline';
import React, { Fragment, useEffect, useState } from 'react';
import { useAlert } from 'react-alert';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import { clearErrors, login } from '../../actions/userAction';
import Loader from '../layout/Loader/Loader';
import MetaData from '../layout/MetaData';

import './Login.css';

const LoginSignup = () => {
    const dispatch = useDispatch();
    const alert = useAlert();

    const navigate = useNavigate();
    const location = useLocation();

    const { loading, error, isAuthenticated } = useSelector(
        (state) => state.user
    );

    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');

    const loginSubmit = (e) => {
        e.preventDefault();
        dispatch(login(loginEmail, loginPassword));
    };

    const redirect = location.search ? location.search.split("=")[1] : '/account';

    useEffect(() => {
        if (error) {
            alert.error(error);
            dispatch(clearErrors());
        }
        if (isAuthenticated) {
            navigate(redirect);
        }
    }, [dispatch, error, alert, navigate, isAuthenticated, redirect]);

    return (
        <Fragment>
            {loading ? (
                <Loader />
            ) : (
                <Fragment>
                    <MetaData title='LOGIN -- ECOMMERCE' />
                    <div className='LoginContainer'>
                        <div className='LoginBox'>
                            <div>
                                <div className='loginToggle'>
                                    <p className="loginTitle">
                                        LOGIN
                                    </p>
                                </div>
                            </div>
                            <form
                                className='loginForm'
                                onSubmit={loginSubmit}
                            >
                                <div className='loginEmail'>
                                    <MailOutlineIcon />
                                    <input
                                        type='email'
                                        placeholder='Email'
                                        required
                                        value={loginEmail}
                                        onChange={e =>
                                            setLoginEmail(e.target.value)
                                        }
                                    />
                                </div>
                                <div className='loginPassword'>
                                    <LockOpenIcon />
                                    <input
                                        type='password'
                                        placeholder='Password'
                                        required
                                        value={loginPassword}
                                        onChange={e =>
                                            setLoginPassword(e.target.value)
                                        }
                                    />
                                </div>
                                <Link to='/password/forgot'>
                                    Forgot Password ?
                                </Link>
                                <Link to='/register' className='registerLink'>
                                    Click to Register
                                </Link>
                                <input
                                    type='submit'
                                    value='Login'
                                    className='loginBtn'
                                />
                            </form>
                        </div>
                    </div>
                </Fragment>
            )}
        </Fragment>
    );
};

export default LoginSignup;
