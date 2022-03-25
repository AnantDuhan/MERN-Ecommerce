import React from 'react';
import { Route, Routes } from 'react-router-dom';
import WebFont from 'webfontloader';

import Home from './components/Home/Home';
import Footer from './components/layout/Footer/Footer';
import Header from './components/layout/Header/Header';
import ProductDetails from './components/Product/ProductDetails';

import './App.css';

function App() {
    React.useEffect(() => {
        WebFont.load({
            google: {
                families: ['Roboto', 'Droid Sans', 'Chilanka'],
            },
        });
    }, []);

    return (
        <div>
            <Header />
            <Routes>
                <Route path="/" element={<Home />} exact/>
                <Route path="/product/:id" element={<ProductDetails />} exact/>
            </Routes>
            <Footer />
        </div>
    );
}

export default App;
