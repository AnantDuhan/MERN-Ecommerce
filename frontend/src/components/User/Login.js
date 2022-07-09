import LockOpenIcon from '@material-ui/icons/LockOpen';
import MailOutlineIcon from '@material-ui/icons/MailOutline';
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

    const [emailInput, setEmailInput] = useState('');
    const [passwordType, setPasswordType] = useState('password');
    const [passwordInput, setPasswordInput] = useState('');

    const loginSubmit = e => {
        e.preventDefault();
        dispatch(login(emailInput, passwordInput));
    };

    const handlePasswordChange = e => {
        setPasswordInput(e.target.value);
    };

    // const togglePassword = () => {
    //     if (passwordType === 'password') {
    //         setPasswordType('text');
    //         return;
    //     }
    //     setPasswordType('password');
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
                    <div className='LoginContainer'>
                        <div className='LoginBox'>
                            <div>
                                <div className='loginToggle'>
                                    <p className='loginTitle'>LOGIN</p>
                                </div>
                            </div>
                            <form className='loginForm' onSubmit={loginSubmit}>
                                <div className='loginEmail'>
                                    <MailOutlineIcon />
                                    <input
                                        type='email'
                                        placeholder='Email'
                                        required
                                        value={emailInput}
                                        onChange={e =>
                                            setEmailInput(e.target.value)
                                        }
                                    />
                                </div>
                                <div className='loginPassword'>
                                    <LockOpenIcon />
                                    <input
                                        type={passwordType}
                                        placeholder='Password'
                                        name='password'
                                        class='form-control'
                                        required
                                        value={passwordInput}
                                        onChange={handlePasswordChange}
                                    />
                                    {/* <div onClick={togglePassword} className='togglePasswordBtn'>
                                        {passwordType === 'password' ? (
                                            <VisibilityIcon />
                                        ) : (
                                            <VisibilityOffIcon />
                                        )}
                                    </div> */}
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
