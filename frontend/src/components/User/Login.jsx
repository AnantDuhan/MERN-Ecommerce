import { Button, Typography } from '@mui/material';
import React, { Fragment, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import { clearErrors, login } from '../../actions/userAction';
import Loader from '../layout/Loader/Loader';
import MetaData from '../layout/MetaData';

import './Login.css';

const LoginSignup = () => {
    const dispatch = useDispatch();

    const navigate = useNavigate();
    const location = useLocation();

    const { loading, error, isAuthenticated } = useSelector(
        state => state.user
    );

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const loginSubmit = e => {
        e.preventDefault();
        dispatch(login(email, password));
    };

    // const handlePasswordChange = e => {
    //     setPassword(e.target.value);
    // };

    const redirect = location.search
        ? location.search.split('=')[1]
        : '/account';

    useEffect(() => {
        if (error) {
            toast.error(error);
            dispatch(clearErrors());
        }
        if (isAuthenticated) {
            navigate(redirect);
        }
    }, [dispatch, error, navigate, isAuthenticated, redirect]);

    return (
        <Fragment>
            {loading ? (
                <Loader />
            ) : (
                <Fragment>
                        <MetaData title='LOGIN -- ECOMMERCE' />
                        
                    <div className='login'>
                        <form className='loginForm' onSubmit={loginSubmit}>
                            <Typography
                                variant='h4'
                                style={{ padding: '2vmax' }}
                            >
                                LOGIN
                            </Typography>

                            <input
                                type='email'
                                placeholder='Email'
                                className='loginInputs'
                                required
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                            />

                            <input
                                type='password'
                                className='loginInputs'
                                placeholder='Password'
                                required
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                            />

                            <Link to='/register'>
                                <Typography>New User?</Typography>
                            </Link>

                            <Link to='/password/forgot'>
                                <Typography>Forgot Password</Typography>
                            </Link>

                            <Button type='submit'>LOGIN</Button>
                        </form>
                    </div>
                </Fragment>
            )}
        </Fragment>
    );
};

export default LoginSignup;
