import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, Grid, Container, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ProductCard from '../ProductCard';
import productsData from '../../data/products.json';
import customersData from '../../data/customers.json';

export default function Home() {
    const navigate = useNavigate();
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [user, setUser] = useState(customersData[0]); // Mock user

    useEffect(() => {
        // Pick first 4 products as featured
        setFeaturedProducts(productsData.slice(0, 4));
    }, []);

    return (
        <Box sx={{ pb: 8 }}>
            {/* Hero Section */}
            <Box
                sx={{
                    height: '60vh',
                    width: '100%',
                    backgroundImage: 'linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=1200)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    color: 'white',
                    textAlign: 'center',
                    mb: 4
                }}
            >
                <Typography variant="h2" sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, mb: 2 }}>
                    Elegance Redefined
                </Typography>
                <Typography variant="h5" sx={{ mb: 4, fontWeight: 300 }}>
                    New Collection 2024
                </Typography>
                <Button
                    variant="contained"
                    size="large"
                    onClick={() => navigate('/products')}
                    sx={{
                        bgcolor: '#FFE600',
                        color: 'black',
                        fontWeight: 'bold',
                        borderRadius: '50px',
                        px: 4,
                        py: 1.5,
                        '&:hover': { bgcolor: '#E6CF00' }
                    }}
                >
                    Shop Now
                </Button>
            </Box>

            {/* Categories */}
            <Container maxWidth="lg" sx={{ mb: 6 }}>
                <Grid container spacing={4}>
                    <Grid item xs={12} md={6}>
                        <Paper
                            sx={{
                                p: 4,
                                height: 250,
                                backgroundImage: 'linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&q=80&w=800)',
                                backgroundSize: 'cover',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                transition: 'transform 0.3s',
                                '&:hover': { transform: 'scale(1.02)' }
                            }}
                            onClick={() => navigate('/products?category=Men')}
                        >
                            <Typography variant="h4" sx={{ color: 'white', fontFamily: "'Playfair Display', serif" }}>MEN</Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Paper
                            sx={{
                                p: 4,
                                height: 250,
                                backgroundImage: 'linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(https://images.unsplash.com/photo-1618932260643-be4bf0fd7169?auto=format&fit=crop&q=80&w=800)',
                                backgroundSize: 'cover',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                transition: 'transform 0.3s',
                                '&:hover': { transform: 'scale(1.02)' }
                            }}
                            onClick={() => navigate('/products?category=Women')}
                        >
                            <Typography variant="h4" sx={{ color: 'white', fontFamily: "'Playfair Display', serif" }}>WOMEN</Typography>
                        </Paper>
                    </Grid>
                </Grid>
            </Container>

            {/* Loyalty Banner */}
            <Container maxWidth="lg" sx={{ mb: 6 }}>
                <Paper
                    sx={{
                        p: 3,
                        bgcolor: 'rgba(255, 230, 0, 0.1)',
                        border: '1px solid rgba(255, 230, 0, 0.3)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexWrap: 'wrap',
                        gap: 2
                    }}
                >
                    <Box>
                        <Typography variant="h6" sx={{ color: '#FFE600' }}>Welcome back, {user.name}!</Typography>
                        <Typography variant="body2" sx={{ color: '#ccc' }}>You have {user.loyaltyPoints} points. Status: {user.loyaltyTier}</Typography>
                    </Box>
                    <Button variant="outlined" sx={{ color: '#FFE600', borderColor: '#FFE600' }}>Redeem Points</Button>
                </Paper>
            </Container>

            {/* Featured Products */}
            <Container maxWidth="lg">
                <Typography variant="h4" sx={{ mb: 3, fontFamily: "'Playfair Display', serif", color: 'white' }}>Trending Now</Typography>
                <Grid container spacing={2}>
                    {featuredProducts.map((p) => (
                        <Grid item xs={12} sm={6} md={3} key={p.id}>
                            <ProductCard product={p} onAddToCart={() => {/* TODO */ }} />
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </Box>
    );
}
