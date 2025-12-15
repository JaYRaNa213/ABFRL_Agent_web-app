import React from 'react';
import { Box, Typography, Button, Grid, Container, Paper, IconButton, Divider } from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext.jsx';

export default function Cart() {
    const navigate = useNavigate();
    const { cart, removeFromCart, updateQuantity } = useCart();

    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const discount = 0; // Logic for offers could go here
    const total = subtotal - discount;

    if (cart.length === 0) {
        return (
            <Container maxWidth="md" sx={{ py: 10, textAlign: 'center' }}>
                <Typography variant="h4" sx={{ color: 'white', mb: 2 }}>Your Cart is Empty</Typography>
                <Button variant="contained" onClick={() => navigate('/products')} sx={{ bgcolor: '#FFE600', color: 'black' }}>
                    Continue Shopping
                </Button>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ py: 6 }}>
            <Typography variant="h3" sx={{ color: 'white', fontFamily: "'Playfair Display', serif", mb: 4 }}>Shopping Cart</Typography>

            <Grid container spacing={4}>
                {/* Cart Items */}
                <Grid item xs={12} md={8}>
                    {cart.map((item) => (
                        <Paper key={item.id + item.size} sx={{ p: 2, mb: 2, bgcolor: '#1e1e1e', color: 'white', display: 'flex', gap: 2 }}>
                            <Box
                                component="img"
                                src={item.image}
                                sx={{ width: 100, height: 100, objectFit: 'cover', borderRadius: 2 }}
                            />
                            <Box sx={{ flexGrow: 1 }}>
                                <Typography variant="h6">{item.name}</Typography>
                                <Typography variant="body2" sx={{ color: 'gray' }}>Size: {item.size} | Color: {item.colors?.[0]}</Typography>
                                <Typography variant="h6" sx={{ color: '#FFE600', mt: 1 }}>₹{item.price.toLocaleString('en-IN')}</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'space-between' }}>
                                <IconButton onClick={() => removeFromCart(item.id)} sx={{ color: 'gray' }}>
                                    <DeleteOutlineIcon />
                                </IconButton>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, bgcolor: 'rgba(255,255,255,0.1)', borderRadius: 1 }}>
                                    <IconButton size="small" onClick={() => updateQuantity(item.id, -1)} sx={{ color: 'white' }}><RemoveIcon fontSize="small" /></IconButton>
                                    <Typography>{item.quantity}</Typography>
                                    <IconButton size="small" onClick={() => updateQuantity(item.id, 1)} sx={{ color: 'white' }}><AddIcon fontSize="small" /></IconButton>
                                </Box>
                            </Box>
                        </Paper>
                    ))}
                </Grid>

                {/* Summary */}
                <Grid item xs={12} md={4}>
                    <Paper sx={{ p: 3, bgcolor: '#1e1e1e', color: 'white', position: 'sticky', top: 100 }}>
                        <Typography variant="h5" sx={{ mb: 3 }}>Order Summary</Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                            <Typography color="gray">Subtotal</Typography>
                            <Typography>₹{subtotal.toLocaleString('en-IN')}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                            <Typography color="gray">Discount</Typography>
                            <Typography sx={{ color: '#4CAF50' }}>- ₹{discount}</Typography>
                        </Box>
                        <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)', my: 2 }} />
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
                            <Typography variant="h6">Total</Typography>
                            <Typography variant="h6" sx={{ color: '#FFE600' }}>₹{total.toLocaleString('en-IN')}</Typography>
                        </Box>

                        <Button
                            variant="contained"
                            fullWidth
                            size="large"
                            onClick={() => navigate('/checkout')}
                            sx={{ bgcolor: '#FFE600', color: 'black', fontWeight: 'bold', '&:hover': { bgcolor: '#E6CF00' } }}
                        >
                            Proceed to Checkout
                        </Button>

                        <Box sx={{ mt: 2, textAlign: 'center' }}>
                            <Typography variant="caption" sx={{ color: 'gray' }}>
                                Use code "ABFRL10" for 10% off
                            </Typography>
                        </Box>
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
}
