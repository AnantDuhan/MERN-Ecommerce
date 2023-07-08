import React, { useState } from 'react';
import { Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import MetaData from '../layout/MetaData';

import './Search.css';

const Search = () => {
    const navigate = useNavigate();
    
    const [product, setProduct] = useState('');

    const searchSubmitHandler = (e) => {
        e.preventDefault();
        if (product.trim()) {
            navigate(`/products/${product}`);
        } else {
            navigate('/products');
        }
    };

    return (
        <div className='search'>
            <MetaData title='Search A Product -- ECOMMERCE' />
            <form className='searchForm' onSubmit={searchSubmitHandler}>
                <Typography variant='h4' style={{ padding: '2vmax' }}>
                    SEARCH PRODUCT
                </Typography>

                <input
                    type='text'
                    value={product}
                    placeholder='What do you want to search?'
                    required
                    onChange={e => setProduct(e.target.value)}
                />

                <Button type='submit'>
                    Search
                </Button>
            </form>
        </div>
    );
};

export default Search;
