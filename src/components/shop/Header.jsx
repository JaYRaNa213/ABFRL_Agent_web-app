import React from 'react';
import { AppBar, Toolbar, Typography, Button, IconButton, Badge, Box } from '@mui/material';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext.jsx';

export default function Header() {
    const navigate = useNavigate();
    const { cart } = useCart();

    return (
        <AppBar position="sticky" sx={{ bgcolor: 'rgba(0,0,0,0.9)', backdropFilter: 'blur(10px)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
            <Toolbar sx={{ justifyContent: 'space-between' }}>
                {/* Brand */}
                <Typography
                    variant="h5"
                    onClick={() => navigate('/')}
                    sx={{
                        fontFamily: "'Playfair Display', serif",
                        cursor: 'pointer',
                        fontWeight: 700,
                        letterSpacing: 1,
                        color: 'white'
                    }}
                >
                    ABFRL <span style={{ color: '#FFE600', fontSize: '0.8em' }}>LIFESTYLE</span>
                </Typography>

                {/* Desktop Nav */}
                <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 4 }}>
                    {['MEN', 'WOMEN', 'KIDS', 'SALE'].map((item) => (
                        <Button
                            key={item}
                            onClick={() => navigate('/products')} // Mock nav for now
                            sx={{
                                color: 'white',
                                fontWeight: 500,
                                letterSpacing: 1,
                                '&:hover': { color: '#FFE600' }
                            }}
                        >
                            {item}
                        </Button>
                    ))}
                </Box>

                {/* Actions */}
                <Box sx={{ display: 'flex', gap: 1 }}>
                    <IconButton sx={{ color: 'white' }}>
                        <SearchOutlinedIcon />
                    </IconButton>
                    <IconButton sx={{ color: 'white' }} onClick={() => navigate('/profile')}>
                        <PersonOutlineOutlinedIcon />
                    </IconButton>
                    <IconButton sx={{ color: 'white' }} onClick={() => navigate('/cart')}>
                        <Badge badgeContent={cart.length} sx={{ '& .MuiBadge-badge': { bgcolor: '#FFE600', color: 'black' } }}>
                            <ShoppingBagOutlinedIcon />
                        </Badge>
                    </IconButton>
                </Box>
            </Toolbar>
        </AppBar>
    );
}
