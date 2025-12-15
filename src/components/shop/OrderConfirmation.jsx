import React from 'react';
import { Box, Typography, Button, Container } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { useNavigate } from 'react-router-dom';
export default function OrderConfirmation() {
    const navigate = useNavigate();

    return (
        <Container maxWidth="sm" sx={{ py: 10, textAlign: 'center', color: 'white' }}>
            <CheckCircleOutlineIcon sx={{ fontSize: 100, color: '#4CAF50', mb: 3 }} />
            <Typography variant="h3" sx={{ fontFamily: "'Playfair Display', serif", mb: 2 }}>Order Confirmed!</Typography>
            <Typography variant="body1" sx={{ color: 'gray', mb: 4 }}>
                Thank you for your purchase. Your order #ABFRL-{Math.floor(Math.random() * 10000)} has been placed successfully.
            </Typography>

            <Typography variant="h6" sx={{ mb: 4 }}>
                A confirmation email has been sent to you.
            </Typography>

            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                <Button
                    variant="contained"
                    onClick={() => navigate('/')}
                    sx={{ bgcolor: '#FFE600', color: 'black', fontWeight: 'bold' }}
                >
                    Continue Shopping
                </Button>
                <Button
                    variant="outlined"
                    sx={{ borderColor: 'white', color: 'white', '&:hover': { borderColor: '#FFE600', color: '#FFE600' } }}
                >
                    Track Order
                </Button>
            </Box>
        </Container>
    );
}
