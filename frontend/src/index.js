import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { Bounce, toast, ToastContainer } from 'react-toastify';

import App from './App';
import store from './store';

import 'react-toastify/dist/ReactToastify.css';

const options = {
    autoClose:  3000,
    position: toast.POSITION.TOP_CENTER,
    transition: Bounce,
};

const container = document.getElementById('root');
const rootContainer = ReactDOM.createRoot(container);
rootContainer.render(
    <BrowserRouter>
        <Provider store={store}>
            <ToastContainer {...options} />
            <App />
        </Provider>
    </BrowserRouter>
);
