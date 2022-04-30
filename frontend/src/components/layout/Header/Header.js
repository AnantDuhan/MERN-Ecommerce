import { ReactNavbar } from 'overlay-navbar';
import React from 'react';
import { FaSearch, FaShoppingCart, FaUserAlt } from 'react-icons/fa';

import logo from '../../../images/logo.png';

const options = {
    logo,
    logoWidth: '20vmax',
    navColor1: 'white',
    navColor2: '#0b111e',
    burgerColorHover: '#eb4034',
    logoHoverSize: '10px',
    logoHoverColor: '#eb4034',
    link1Text: 'Home',
    link2Text: 'Products',
    link3Text: 'Contact',
    link4Text: 'About',
    link1Url: '/',
    link2Url: '/products',
    link3Url: '/contact',
    link4Url: '/about',
    link1Size: '1.3vmax',
    link1Color: 'white',
    nav1justifyContent: 'flex-end',
    nav2justifyContent: 'flex-end',
    nav3justifyContent: 'flex-start',
    nav4justifyContent: 'flex-start',
    link1ColorHover: '#eb4034',
    link1Margin: '1vmax',
    profileIcon: true,
    ProfileIconElement: FaUserAlt,
    profileIconUrl: '/login',
    profileIconColor: 'white',
    profileIconColorHover: '#eb4034',
    searchIconColor: 'white',
    cartIcon: true,
    CartIconElement: FaShoppingCart,
    CartIconUrl: '/cart',
    cartIconColor: 'white',
    searchIcon: true,
    SearchIconElement: FaSearch,
    SearchIconUrl: '/search',
    searchIconColorHover: '#eb4034',
    cartIconColorHover: '#eb4034',
    cartIconMargin: '1vmax',
};

const Header = () => {
    return (
        <ReactNavbar {...options} />
    )
};

export default Header;
