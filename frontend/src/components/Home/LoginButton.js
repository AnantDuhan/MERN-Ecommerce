import Button from '@mui/material/Button';
// LoginButton.js
import React from 'react';
import { useNavigate } from 'react-router';

const LoginButton = () => {

    const navigate = useNavigate();

    const handleLogin = () => {
        navigate('/login')
        console.log('User clicked login button');
    };

    return (
        <Button
            color='inherit'
            onClick={handleLogin}
        >
            Login
        </Button>
    );
};

export default LoginButton;
