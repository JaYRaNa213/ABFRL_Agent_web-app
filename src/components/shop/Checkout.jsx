import React, { useState } from 'react';
import { Box, Typography, Button, Container, Paper, Radio, RadioGroup, FormControlLabel, Divider, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext.jsx';
import paymentsData from '../../data/payments.json';

export default function Checkout() {
    const navigate = useNavigate();
    const { cart, setCart } = useCart();
    const [selectedPayment, setSelectedPayment] = useState(paymentsData[0].id);
    const [loading, setLoading] = useState(false);

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    const handlePayment = () => {
        setLoading(true);
        // Mock API call delay
        setTimeout(() => {
            setLoading(false);
            setCart([]); // Clear cart
            navigate('/order-confirmation');
        }, 2000);
    };

    if (cart.length === 0) {
        navigate('/cart');
        return null;
    }

    return (
        <Container maxWidth="md" sx={{ py: 6 }}>
            <Typography variant="h3" sx={{ color: 'white', fontFamily: "'Playfair Display', serif", mb: 4 }}>Checkout</Typography>

            <Grid container spacing={4}>
                <Grid item xs={12} md={8}>
                    <Paper sx={{ p: 4, bgcolor: '#1e1e1e', color: 'white', mb: 3 }}>
                        <Typography variant="h6" sx={{ mb: 2 }}>Payment Method</Typography>
                        <RadioGroup value={selectedPayment} onChange={(e) => setSelectedPayment(e.target.value)}>
                            {paymentsData.map(method => (
                                <Box key={method.id} sx={{ mb: 1, p: 1, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 2 }}>
                                    <FormControlLabel
                                        value={method.id}
                                        control={<Radio sx={{ color: '#FFE600', '&.Mui-checked': { color: '#FFE600' } }} />}
                                        label={method.name}
                                    />
                                </Box>
                            ))}
                        </RadioGroup>
                    </Paper>
                </Grid>

                <Grid item xs={12} md={4}>
                    <Paper sx={{ p: 3, bgcolor: '#1e1e1e', color: 'white' }}>
                        <Typography variant="h6" sx={{ mb: 2 }}>Order Total</Typography>
                        <Typography variant="h4" sx={{ color: '#FFE600', mb: 4 }}>₹{total.toLocaleString('en-IN')}</Typography>

                        <Button
                            variant="contained"
                            fullWidth
                            size="large"
                            onClick={handlePayment}
                            disabled={loading}
                            sx={{
                                bgcolor: '#FFE600',
                                color: 'black',
                                fontWeight: 'bold',
                                '&:hover': { bgcolor: '#E6CF00' },
                                py: 2
                            }}
                        >
                            {loading ? 'Processing...' : `Pay ₹${total.toLocaleString('en-IN')}`}
                        </Button>
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
}
