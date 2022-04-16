import { applyMiddleware, combineReducers, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';

import { cartReducer } from './reducers/cartReducer';
import {
    allOrdersReducer,
    myOrdersReducer,
    newOrderReducer,
    orderDetailsReducer,
    orderReducer,
} from './reducers/orderReducer';
import { newReviewReducer, productDetailsReducer, productsReducer } from './reducers/productReducer';
import { forgotPasswordReducer, profileReducer, userReducer } from './reducers/userReducer';

const reducer = combineReducers({
    // product reducer
    products: productsReducer,
    productDetails: productDetailsReducer,

    // user reducer
    user: userReducer,
    profile: profileReducer,
    forgotPassword: forgotPasswordReducer,

    // cart reducer
    cart: cartReducer,

    // order reducer
    newOrder: newOrderReducer,
    myOrders: myOrdersReducer,
    allOrders: allOrdersReducer,
    order: orderReducer,
    orderDetails: orderDetailsReducer,

    // others
    newReview: newReviewReducer,
});

let initialState = {
    cart: {
        cartItems: localStorage.getItem('cartItems')
            ? JSON.parse(localStorage.getItem('cartItems'))
            : [],
        shippingInfo: localStorage.getItem('shippingInfo')
            ? JSON.parse(localStorage.getItem('shippingInfo'))
            : {},
    },
};

const middleware = [thunk];

const store = createStore(
    reducer,
    initialState,
    composeWithDevTools(applyMiddleware(...middleware))
);

export default store;
