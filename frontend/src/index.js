/***
 * @Author:xxx
 * @Date:2022-04-13 11:40:07
 * @LastModifiedBy:xxx
 * @Last Modified time:2022-04-13 11:40:07
 */

import React from 'react';
import { Provider as AlertProvider, positions, transitions } from 'react-alert';
import AlertTemplate from 'react-alert-template-basic';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

// import { BrowserRouter } from 'react-router-dom';

import App from './App';
import store from './store';

const options = {
    timeout: 5000,
    position: positions.BOTTOM_CENTER,
    transition: transitions.SCALE,
};

// ReactDOM.render(
//     <BrowserRouter>
//         <Provider store={store}>
//             <AlertProvider template={AlertTemplate} {...options}>
//                 <App />
//             </AlertProvider>
//         </Provider>
//     </BrowserRouter>,
//     document.getElementById('root')
// );

const container = document.getElementById('root');
const rootContainer = ReactDOM.createRoot(container);
rootContainer.render(
    <BrowserRouter>
        <Provider store={store}>
            <AlertProvider template={AlertTemplate} {...options}>
                <App />
            </AlertProvider>
        </Provider>
    </BrowserRouter>
);
