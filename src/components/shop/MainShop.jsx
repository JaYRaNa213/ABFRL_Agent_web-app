import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Box } from '@mui/material';
import Header from './Header.jsx';
import Home from './Home.jsx';
import ProductListing from './ProductListing.jsx';
import ProductDetail from './ProductDetail.jsx';
import Cart from './Cart.jsx';
import Checkout from './Checkout.jsx';
import OrderConfirmation from './OrderConfirmation.jsx';
import Profile from './Profile.jsx';

export default function MainShop() {
    return (
        <Box sx={{ minHeight: "100%", bgcolor: "var(--primary-dark)", color: "white" }}>

            <Header />

            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/products" element={<ProductListing />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/order-confirmation" element={<OrderConfirmation />} />
                <Route path="/profile" element={<Profile />} />
            </Routes>
        </Box>
    );
}
