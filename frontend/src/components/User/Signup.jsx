import React, { Fragment, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Avatar, Typography, Button } from '@mui/material';
import { clearErrors, register } from '../../actions/userAction';
import Loader from '../layout/Loader/Loader';
import MetaData from '../layout/MetaData';
import { Link } from 'react-router-dom';

import './Signup.css';

const LoginSignup = () => {

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [avatar, setAvatar] = useState('');

    const dispatch = useDispatch();

    const navigate = useNavigate();
    const location = useLocation();

    const { loading, error, isAuthenticated } = useSelector(
        state => state.user
    );

    const registerDataChange = (e) => {
        const file = e.target.files[0];

        const Reader = new FileReader();
        Reader.readAsDataURL(file);

        Reader.onload = () => {
            if (Reader.readyState === 2) {
                setAvatar(Reader.result);
            }
        };
        e.preventDefault();
    };

    const registerSubmit = e => {
        e.preventDefault();
        dispatch(register(name, email, password, avatar));
    };

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
                    <MetaData title='SIGNUP -- ECOMMERCE' />
                        
                    <div className='register'>
                        <form
                            className='registerForm'
                            onSubmit={registerSubmit}
                        >
                            <Typography
                                variant='h4'
                                style={{ padding: '2vmax' }}
                            >
                                SIGNUP NOW
                            </Typography>

                            <Avatar
                                src={avatar}
                                alt='User'
                                sx={{ height: '7vmax', width: '7vmax' }}
                            />

                            <input
                                type='file'
                                accept='image/*'
                                onChange={registerDataChange}
                            />

                            <input
                                type='text'
                                value={name}
                                placeholder='Name'
                                className='registerInputs'
                                required
                                onChange={e => setName(e.target.value)}
                            />

                            <input
                                type='email'
                                placeholder='Email'
                                className='registerInputs'
                                required
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                            />

                            <input
                                type='password'
                                className='registerInputs'
                                placeholder='Password'
                                required
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                            />

                            <Link to='/login'>
                                <Typography>
                                    Already Signed Up? Login Now
                                </Typography>
                            </Link>

                            <Button type='submit'>REGISTER</Button>
                        </form>
                    </div>
                </Fragment>
            )}
        </Fragment>
    );
};

export default LoginSignup;
