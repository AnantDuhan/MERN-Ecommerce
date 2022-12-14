import FaceIcon from '@material-ui/icons/Face';
import MailOutlineIcon from '@material-ui/icons/MailOutline';
import { Avatar, Button, Typography } from '@mui/material';
import React, { Fragment, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';

import { clearErrors, loadUser, updateProfile } from '../../actions/userAction';
import { UPDATE_PROFILE_RESET } from '../../constants/userConstants';
import Loader from '../layout/Loader/Loader';
import MetaData from '../layout/MetaData';

import './UpdateProfile.css';

const UpdateProfile = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { user } = useSelector((state) => state.user);
    const { error, isUpdated, loading } = useSelector((state) => state.profile);

    
    const [name, setName] = useState(user.name);
    const [email, setEmail] = useState(user.email);
    const [avatar, setAvatar] = useState('');
    const [avatarPreview, setAvatarPreview] = useState(user?.avatar?.url);

    const updateProfileSubmit = (e) => {
        e.preventDefault();
        dispatch(updateProfile(name, email, avatar));
        dispatch(loadUser());
    };

    const updateProfileDataChange = (e) => {
        const file = e.target.files[0];

        const Reader = new FileReader();
        Reader.readAsDataURL(file);

        Reader.onload = () => {
            if (Reader.readyState === 2) {
                setAvatarPreview(Reader.result);

                setAvatar(Reader.result);
            }
        };
    };

    useEffect(() => {
        if (user) {
            setName(user.name);
            setEmail(user.email);
            setAvatarPreview(user.avatar?.url);
        }

        if (error) {
            toast.error(error);
            dispatch(clearErrors());
        }

        if (isUpdated) {
            toast.success('Profile Updated Successfully');
            dispatch(loadUser());

            navigate('/account');

            dispatch({
                type: UPDATE_PROFILE_RESET,
            });
        }
    }, [dispatch, error, user, isUpdated, navigate]);
    return (
        <Fragment>
            {loading ? (
                <Loader />
            ) : (
                <Fragment>
                    <MetaData title='Update Profile' />
                    {/* <div className="updateProfileContainer">
                        <div className="updateProfileBox">
                            <h2 className="updateProfileHeading">
                                Update Profile
                            </h2>

                            <form
                                className="updateProfileForm"
                                encType="multipart/form-data"
                                onSubmit={updateProfileSubmit}
                            >
                                <div className="updateProfileName">
                                    <FaceIcon />
                                    <input
                                        type="text"
                                        placeholder="Name"
                                        required
                                        name="name"
                                        value={name}
                                        onChange={(e) =>
                                            setName(e.target.value)
                                        }
                                    />
                                </div>
                                <div className="updateProfileEmail">
                                    <MailOutlineIcon />
                                    <input
                                        type="email"
                                        placeholder="Email"
                                        required
                                        name="email"
                                        value={email}
                                        onChange={(e) =>
                                            setEmail(e.target.value)
                                        }
                                    />
                                </div>

                                <div id="updateProfileImage">
                                    <img
                                        src={avatarPreview}
                                        alt="Avatar Preview"
                                    />
                                    <input
                                        type="file"
                                        name="avatar"
                                        accept="image/*"
                                        onChange={updateProfileDataChange}
                                    />
                                </div>
                                <input
                                    type="submit"
                                    value="Update"
                                    className="updateProfileBtn"
                                />
                            </form>
                        </div>
                    </div> */}

                    <div className='updateProfile'>
                        <form
                            className='updateProfileForm'
                            onSubmit={updateProfileSubmit}
                        >
                            <Typography
                                variant='h3'
                                style={{ padding: '2vmax' }}
                            >
                                Update Profile
                            </Typography>

                            <Avatar
                                src={avatarPreview}
                                alt='User'
                                sx={{ height: '10vmax', width: '10vmax' }}
                            />

                            <input
                                type='file'
                                accept='image/*'
                                onChange={updateProfileDataChange}
                            />

                            <input
                                type='text'
                                value={name}
                                placeholder='Name'
                                className='updateProfileInputs'
                                required
                                onChange={e => setName(e.target.value)}
                            />

                            <input
                                type='email'
                                placeholder='Email'
                                className='updateProfileInputs'
                                required
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                            />

                            <Button disabled={loading} type='submit'>
                                Update
                            </Button>
                        </form>
                    </div>
                </Fragment>
            )}
        </Fragment>
    );
};

export default UpdateProfile;
