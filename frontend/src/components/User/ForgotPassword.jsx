import { Button, Typography } from '@mui/material';
import React, { Fragment, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

import { clearErrors, forgotPassword } from '../../actions/userAction';
import Loader from '../layout/Loader/Loader';
import MetaData from '../layout/MetaData';

import './ForgotPassword.css';

const ForgotPassword = () => {
    const dispatch = useDispatch();

    const { error, message, loading } = useSelector(
        (state) => state.forgotPassword
    );

    const [email, setEmail] = useState('');

    const forgotPasswordSubmit = (e) => {
        e.preventDefault();

        const myForm = new FormData();

        myForm.set('email', email);
        dispatch(forgotPassword(myForm));
    };

    useEffect(() => {
        if (error) {
            toast.error(error);
            dispatch(clearErrors());
        }

        if (message) {
            toast.success(message);
        }
    }, [dispatch, error, message]);

    return (
        <Fragment>
            {loading ? (
                <Loader />
            ) : (
                <Fragment>
                    <MetaData title='Forgot Password' />
                    <div className='forgotPassword'>
                        <form
                            className='forgotPasswordForm'
                            onSubmit={forgotPasswordSubmit}
                        >
                            <Typography
                                variant='h4'
                                style={{ padding: '2vmax' }}
                            >
                                FORGOT PASSWORD
                            </Typography>

                            <input
                                type='email'
                                placeholder='Email'
                                className='forgotPasswordInputs'
                                required
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                            />

                            <Button type='submit'>SEND</Button>
                        </form>
                    </div>
                </Fragment>
            )}
        </Fragment>
    );
};

export default ForgotPassword;
