import FaceIcon from '@material-ui/icons/Face';
import LockOpenIcon from '@material-ui/icons/LockOpen';
import MailOutlineIcon from '@material-ui/icons/MailOutline';
import FormData from 'form-data';
import React, { Fragment, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import { clearErrors, register } from '../../actions/userAction';
import Loader from '../layout/Loader/Loader';
import MetaData from '../layout/MetaData';

import './Signup.css';

const LoginSignup = () => {
    const dispatch = useDispatch();

    const navigate = useNavigate();
    const location = useLocation();

    const { loading, error, isAuthenticated } = useSelector(
        state => state.user
    );

    const [user, setUser] = useState({
        name: '',
        email: '',
        password: ''
    });

    const { name, email, password } = user;

    const [avatar, setAvatar] = useState();
    const [avatarPreview, setAvatarPreview] = useState('/Profile.png');

    const registerSubmit = e => {
        e.preventDefault();

        const myForm = new FormData();

        myForm.set('name', name);
        myForm.set('email', email);
        myForm.set('password', password);
        avatar.forEach(avatar => {
            myForm.append('avatar', avatar);
        });
        dispatch(register(myForm));
    };

    const registerDataChange = e => {
        if (e.target.name === 'avatar') {
            const files = Array.from(e.target.files);

            setAvatar([]);
            setAvatarPreview([]);

            files.forEach(file => {
                const reader = new FileReader();

                reader.onLoad = () => {
                    if (reader.readyState === 2) {
                        setAvatarPreview(old => [...old, reader.result]);
                        setAvatar(old => [...old, reader.result]);
                    }
                };
                reader.readAsDataURL(file);
            });
        } else {
            setUser({ ...user, [e.target.name]: e.target.value });
        }
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
                    <div className='SignUpContainer'>
                        <div className='SignUpBox'>
                            <div>
                                <div className='signUp_toggle'>
                                    <p
                                        className='registerTitle'
                                    >
                                        REGISTER
                                    </p>
                                </div>
                            </div>

                            <form
                                className='signUpForm'
                                encType='multipart/form-data'
                                onSubmit={registerSubmit}
                            >
                                <div className='signUpName'>
                                    <FaceIcon />
                                    <input
                                        type='text'
                                        placeholder='Name'
                                        required
                                        name='name'
                                        value={name}
                                        onChange={registerDataChange}
                                    />
                                </div>
                                <div className='signUpEmail'>
                                    <MailOutlineIcon />
                                    <input
                                        type='email'
                                        placeholder='Email'
                                        required
                                        name='email'
                                        value={email}
                                        onChange={registerDataChange}
                                    />
                                </div>
                                <div className='signUpPassword'>
                                    <LockOpenIcon />
                                    <input
                                        type='password'
                                        placeholder='Password'
                                        required
                                        name='password'
                                        value={password}
                                        onChange={registerDataChange}
                                    />
                                </div>
                                <div id='registerImage'>
                                    <img
                                        src={avatarPreview}
                                        alt='avatar'
                                    />
                                    <input
                                        type='file'
                                        name='avatar'
                                        accept='image/*'
                                        onChange={registerDataChange}
                                    />
                                    </div>
                                <input
                                    type='submit'
                                    value='Register'
                                    className='signUpBtn'
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
