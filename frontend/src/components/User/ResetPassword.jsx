import { Button, Typography } from '@mui/material';
import React, { Fragment, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router';
import { toast } from 'react-toastify';

import { clearErrors, resetPassword } from '../../actions/userAction';
import Loader from '../layout/Loader/Loader';
import MetaData from '../layout/MetaData';

import './ResetPassword.css';

const ResetPassword = ({ match }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { token } = useParams();

    const { error, success, loading } = useSelector(
        (state) => state.forgotPassword
    );

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const resetPasswordSubmit = (e) => {
        e.preventDefault();

        const myForm = new FormData();

        myForm.set('password', password);
        myForm.set('confirmPassword', confirmPassword);

        dispatch(resetPassword(token, myForm));
    };

    useEffect(() => {
        if (error) {
            toast.error(error);
            dispatch(clearErrors());
        }

        if (success) {
            toast.success('Password Updated Successfully');

            navigate('/login');
        }
    }, [dispatch, error, navigate, success]);

    return (
        <Fragment>
            {loading ? (
                <Loader />
            ) : (
                <Fragment>
                    <MetaData title='Change Password' />

                    <div className='resetPassword'>
                        <form
                            className='resetPasswordForm'
                            onSubmit={resetPasswordSubmit}
                        >
                            <Typography
                                variant='h4'
                                style={{ padding: '2vmax' }}
                            >
                                RESET PASSWORD
                            </Typography>

                            <input
                                type='password'
                                placeholder='New Password'
                                className='resetPasswordInputs'
                                required
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                            />

                            <input
                                type='password'
                                className='resetPasswordInputs'
                                placeholder='Confirm Password'
                                required
                                value={confirmPassword}
                                onChange={e =>
                                    setConfirmPassword(e.target.value)
                                }
                            />

                            <Button type='submit'>LOGIN</Button>
                        </form>
                    </div>
                </Fragment>
            )}
        </Fragment>
    );
};

export default ResetPassword;
