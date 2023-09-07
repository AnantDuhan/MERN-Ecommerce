import { returnRequest } from '../../actions/orderAction';
import React, { Fragment, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

import MetaData from '../layout/MetaData';

import './ReturnRequest.css';
import { toast } from 'react-toastify';

const ReturnRequest = () => {
    const [returnReason, setReturnReason] = useState('');

    const dispatch = useDispatch();
    const { id } = useParams();
    const navigate = useNavigate();

    const returnReasons = [
        'Defective Product',
        'Wrong Product Shipped',
        'Received Incomplete Order',
        "Product Doesn't Match Description",
        'Size Does Not Fit',
        "Color Doesn't Match",
        'Changed My Mind',
        'Item Arrived Late',
        'Ordered by Mistake',
        'Unsatisfactory Quality',
        'Received Damaged Product',
        'Ordered Duplicate Product',
        'Product Expired/Short Expiry Date',
        'Not Satisfied with Performance',
        "Item Doesn't Meet Expectations"
    ];

    const submitReturnRequest = e => {
        e.preventDefault();
        if (id && returnReason) {
            dispatch(returnRequest(id, returnReason));
            toast.success('Return request submitted successfully');
            navigate('/orders');
        }
    };

    return (
        <Fragment>
            <MetaData title='Request Return -- ECOMMERCE' />
            <form className='returnRequestBox' onSubmit={submitReturnRequest}>
                <select onChange={e => setReturnReason(e.target.value)}>
                    <option value=''>Select Return Reason</option>
                    {returnReasons.map((reason, index) => (
                        <option key={index} value={reason}>
                            {reason}
                        </option>
                    ))}
                </select>
                <input type='submit' value='Return' />
            </form>
        </Fragment>
    );
};

export default ReturnRequest;
