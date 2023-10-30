import {
    CREATE_SUBSCRIPTION_REQUEST,
    CREATE_SUBSCRIPTION_SUCCESS,
    CREATE_SUBSCRIPTION_FAIL,
    SUBSCRIPTION_REQUEST,
    SUBSCRIPTION_SUCCESS,
    SUBSCRIPTION_FAIL,
    GET_SUBSCRIPTION_DETAIL_REQUEST,
    GET_SUBSCRIPTION_DETAIL_SUCCESS,
    GET_SUBSCRIPTION_DETAIL_FAIL,
    UPDATE_SUBSCRIPTION_REQUEST,
    UPDATE_SUBSCRIPTION_SUCCESS,
    UPDATE_SUBSCRIPTION_FAIL,
    CANCEL_SUBSCRIPTION_REQUEST,
    CANCEL_SUBSCRIPTION_SUCCESS,
    CANCEL_SUBSCRIPTION_FAIL,
    DELETE_SUBSCRIPTION_REQUEST,
    DELETE_SUBSCRIPTION_SUCCESS,
    DELETE_SUBSCRIPTION_FAIL,
    CLEAR_SUBSCRIPTION,
    CLEAR_ERRORS,
    ALL_PRICES_REQUEST,
    ALL_PRICES_SUCCESS,
    ALL_PRICES_FAIL
} from '../constants/subscriptionConstants';

const initialState = {
    subscriptions: [],
    loading: false,
    error: null
};

const subscriptionReducer = (state = initialState, action) => {
    switch (action.type) {
        case ALL_PRICES_REQUEST:
        case CREATE_SUBSCRIPTION_REQUEST:
        case SUBSCRIPTION_REQUEST:
        case GET_SUBSCRIPTION_DETAIL_REQUEST:
        case UPDATE_SUBSCRIPTION_REQUEST:
        case CANCEL_SUBSCRIPTION_REQUEST:
        case DELETE_SUBSCRIPTION_REQUEST:
            return {
                ...state,
                loading: true
            };
        case ALL_PRICES_SUCCESS:
            return {
                ...state,
                loading: false,
                prices: action.payload
            };
        case CREATE_SUBSCRIPTION_SUCCESS:
        case SUBSCRIPTION_SUCCESS:
        case GET_SUBSCRIPTION_DETAIL_SUCCESS:
        case UPDATE_SUBSCRIPTION_SUCCESS:
        case CANCEL_SUBSCRIPTION_SUCCESS:
        case DELETE_SUBSCRIPTION_SUCCESS:
            return {
                ...state,
                loading: false,
                subscriptions: action.payload
            };

        case ALL_PRICES_FAIL:
        case CREATE_SUBSCRIPTION_FAIL:
        case SUBSCRIPTION_FAIL:
        case GET_SUBSCRIPTION_DETAIL_FAIL:
        case UPDATE_SUBSCRIPTION_FAIL:
        case CANCEL_SUBSCRIPTION_FAIL:
        case DELETE_SUBSCRIPTION_FAIL:
            return {
                ...state,
                loading: false,
                error: action.payload
            };

        case CLEAR_SUBSCRIPTION:
            return {
                ...state,
                subscriptions: []
            };

        case CLEAR_ERRORS:
            return {
                ...state,
                error: null
            };

        default:
            return state;
    }
};

export default subscriptionReducer;
