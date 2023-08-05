import { Button, Typography } from '@mui/material';
import React, { Fragment, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';

import { clearErrors, updatePassword } from '../../actions/userAction';
import { UPDATE_PASSWORD_RESET } from '../../constants/userConstants';
import Loader from '../layout/Loader/Loader';
import MetaData from '../layout/MetaData';

import './UpdatePassword.css';

const UpdatePassword = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { error, isUpdated, loading } = useSelector((state) => state.profile);

    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const updatePasswordSubmit = (e) => {
        e.preventDefault();

        const myForm = new FormData();

        myForm.set('oldPassword', oldPassword);
        myForm.set('newPassword', newPassword);
        myForm.set('confirmPassword', confirmPassword);

        dispatch(updatePassword(myForm));
    };

    useEffect(() => {
        if (error) {
            toast.error(error);
            dispatch(clearErrors());
        }

        if (isUpdated) {
            toast.success('Profile Updated Successfully');

            navigate('/account');

            dispatch({
                type: UPDATE_PASSWORD_RESET,
            });
        }
    }, [dispatch, error, navigate, isUpdated]);

    return (
        <Fragment>
            {loading ? (
                <Loader />
            ) : (
                <Fragment>
                    <MetaData title='Change Password' />

                    <div className='updatePassword'>
                        <form
                            className='updatePasswordForm'
                            onSubmit={updatePasswordSubmit}
                        >
                            <Typography
                                variant='h4'
                                style={{ padding: '2vmax' }}
                            >
                                UPDATE PASSWORD
                            </Typography>

                            <input
                                type='password'
                                placeholder='Old Password'
                                className='updatePasswordInputs'
                                required
                                value={oldPassword}
                                onChange={e => setOldPassword(e.target.value)}
                            />

                            <input
                                type='password'
                                placeholder='New Password'
                                className='updatePasswordInputs'
                                required
                                value={newPassword}
                                onChange={e => setNewPassword(e.target.value)}
                            />

                            <input
                                type='password'
                                className='updatePasswordInputs'
                                placeholder='Confirm Password'
                                required
                                value={confirmPassword}
                                onChange={e =>
                                    setConfirmPassword(e.target.value)
                                }
                            />

                            <Button type='submit'>UPDATE PASSWORD</Button>
                        </form>
                    </div>
                </Fragment>
            )}
        </Fragment>
    );
};

export default UpdatePassword;
