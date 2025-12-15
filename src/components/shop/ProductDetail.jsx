import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Button, Grid, Container, Chip, Divider, IconButton } from '@mui/material';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import productsData from '../../data/products.json';
import inventoryData from '../../data/inventory.json';
import { useCart } from '../../context/CartContext.jsx';
import { useSession } from '../../context/SessionContext.jsx';

export default function ProductDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const { triggerAgentMessage } = useSession();
    const [product, setProduct] = useState(null);
    const [stock, setStock] = useState(null);
    const [selectedSize, setSelectedSize] = useState('');

    useEffect(() => {
        const found = productsData.find(p => p.id === id);
        if (found) {
            setProduct(found);
            setStock(inventoryData[id]);
            if (found.sizes && found.sizes.length > 0) setSelectedSize(found.sizes[0]);
        }
    }, [id]);

    if (!product) return <Typography sx={{ color: 'white', p: 4 }}>Loading...</Typography>;

    return (
        <Container maxWidth="lg" sx={{ py: 6 }}>
            <Button onClick={() => navigate(-1)} sx={{ color: 'gray', mb: 2 }}>&larr; Back</Button>
            <Grid container spacing={6}>
                {/* Image Section */}
                <Grid item xs={12} md={6}>
                    <Box
                        component="img"
                        src={product.image}
                        alt={product.name}
                        sx={{ width: '100%', borderRadius: 4, boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }}
                    />
                </Grid>

                {/* Details Section */}
                <Grid item xs={12} md={6}>
                    <Typography variant="overline" sx={{ color: '#FFE600', letterSpacing: 2 }}>{product.brand}</Typography>
                    <Typography variant="h3" sx={{ color: 'white', fontFamily: "'Playfair Display', serif", mb: 2 }}>
                        {product.name}
                    </Typography>
                    <Typography variant="h4" sx={{ color: 'white', fontWeight: 700, mb: 3 }}>
                        ₹{product.price.toLocaleString('en-IN')}
                    </Typography>

                    <Typography variant="body1" sx={{ color: 'lightgray', mb: 4, lineHeight: 1.8 }}>
                        {product.description}
                    </Typography>

                    {/* Selection */}
                    <Box sx={{ mb: 4 }}>
                        <Typography sx={{ color: 'white', mb: 1 }}>Select Size</Typography>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                            {product.sizes.map(size => (
                                <Chip
                                    key={size}
                                    label={size}
                                    onClick={() => setSelectedSize(size)}
                                    sx={{
                                        bgcolor: selectedSize === size ? '#FFE600' : 'rgba(255,255,255,0.1)',
                                        color: selectedSize === size ? 'black' : 'white',
                                        cursor: 'pointer',
                                        '&:hover': { bgcolor: selectedSize === size ? '#FFE600' : 'rgba(255,255,255,0.2)' }
                                    }}
                                />
                            ))}
                        </Box>
                    </Box>

                    {/* Stock Status */}
                    {stock && (
                        <Box sx={{ mb: 4, p: 2, bgcolor: 'rgba(255,255,255,0.05)', borderRadius: 2 }}>
                            <Typography variant="body2" sx={{ color: stock.online > 5 ? '#4CAF50' : 'orange' }}>
                                {stock.online > 0 ? `In Stock (${stock.online} available online)` : 'Out of Stock'}
                            </Typography>
                        </Box>
                    )}

                    {/* Actions */}
                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <Button
                            variant="contained"
                            size="large"
                            startIcon={<AddShoppingCartIcon />}
                            onClick={() => addToCart({ ...product, size: selectedSize })}
                            sx={{
                                flexGrow: 1,
                                bgcolor: '#FFE600',
                                color: 'black',
                                fontWeight: 'bold',
                                '&:hover': { bgcolor: '#E6CF00' }
                            }}
                        >
                            Add to Cart
                        </Button>
                        <Button
                            variant="outlined"
                            size="large"
                            startIcon={<ChatBubbleOutlineIcon />}
                            onClick={() => triggerAgentMessage(`Can you tell me more about ${product.name}?`)}
                            sx={{
                                borderColor: 'white',
                                color: 'white',
                                '&:hover': { borderColor: '#FFE600', color: '#FFE600' }
                            }}
                        >
                            Ask AI Assistant
                        </Button>
                    </Box>
                </Grid>
            </Grid>
        </Container>
    );
}
