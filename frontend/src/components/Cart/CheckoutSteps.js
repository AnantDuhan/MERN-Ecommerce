import { Step, StepLabel, Stepper, Typography } from '@material-ui/core';
import AccountBalanceIcon from '@material-ui/icons/AccountBalance';
import LibraryAddCheckIcon from '@material-ui/icons/LibraryAddCheck';
import LocalShippingIcon from '@material-ui/icons/LocalShipping';
import React, { Fragment } from 'react';

import './CheckoutSteps.css';

const CheckoutSteps = ({ activeStep }) => {
    const steps = [
        {
            label: <Typography>Shipping Details</Typography>,
            icon: <LocalShippingIcon />
        },
        {
            label: <Typography>Confirm Order</Typography>,
            icon: <LibraryAddCheckIcon />
        },
        {
            label: <Typography>Payment</Typography>,
            icon: <AccountBalanceIcon />
        }
    ];

    const stepStyles = {
        boxSizing: 'border-box'
    };

    return (
        <Fragment>
            <Stepper
                alternativeLabel
                activeStep={activeStep}
                style={stepStyles}
            >
                {steps.map((item, index) => (
                    <Step
                        key={index}
                        active={activeStep === index ? true : false}
                        completed={activeStep >= index ? true : false}
                    >
                        <StepLabel
                            style={{
                                color:
                                    activeStep >= index
                                        ? '#00008B'
                                        : 'rgba(0, 0, 0, 0.649)'
                            }}
                            icon={item.icon}
                        >
                            {item.label}
                        </StepLabel>
                    </Step>
                ))}
            </Stepper>
        </Fragment>
    );
};

export default CheckoutSteps;
