import React, { useEffect, useState } from 'react';
import { Box, Typography, Grid, Container, FormControl, InputLabel, Select, MenuItem, Slider } from '@mui/material';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../ProductCard';
import productsData from '../../data/products.json';
import { useCart } from '../../context/CartContext.jsx';
import { useSession } from '../../context/SessionContext.jsx';

export default function ProductListing() {
    const [searchParams] = useSearchParams();
    const categoryParam = searchParams.get('category');

    const [products, setProducts] = useState([]);
    const [categoryFilter, setCategoryFilter] = useState('All');
    const [priceRange, setPriceRange] = useState([0, 20000]);

    const { addToCart } = useCart();
    const { triggerAgentMessage } = useSession();

    useEffect(() => {
        let filtered = productsData;

        if (categoryParam) {
            setCategoryFilter(categoryParam);
            filtered = filtered.filter(p => p.category === categoryParam);
        } else if (categoryFilter !== 'All') {
            filtered = filtered.filter(p => p.category === categoryFilter);
        }

        filtered = filtered.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);

        setProducts(filtered);
    }, [categoryParam, categoryFilter, priceRange]);

    return (
        <Container maxWidth="xl" sx={{ py: 4 }}>
            <Grid container spacing={4}>
                {/* Filters Sidebar */}
                <Grid item xs={12} md={3}>
                    <Box sx={{ p: 3, bgcolor: '#1e1e1e', borderRadius: 2, position: 'sticky', top: 100 }}>
                        <Typography variant="h6" sx={{ color: 'white', mb: 3 }}>Filters</Typography>

                        <FormControl fullWidth sx={{ mb: 3 }}>
                            <InputLabel id="cat-label" sx={{ color: 'gray' }}>Category</InputLabel>
                            <Select
                                labelId="cat-label"
                                value={categoryFilter}
                                label="Category"
                                onChange={(e) => setCategoryFilter(e.target.value)}
                                sx={{ color: 'white', '.MuiOutlinedInput-notchedOutline': { borderColor: 'gray' }, '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#FFE600' } }}
                            >
                                <MenuItem value="All">All</MenuItem>
                                <MenuItem value="Men">Men</MenuItem>
                                <MenuItem value="Women">Women</MenuItem>
                            </Select>
                        </FormControl>

                        <Typography gutterBottom sx={{ color: 'gray' }}>Price Range</Typography>
                        <Slider
                            value={priceRange}
                            onChange={(e, val) => setPriceRange(val)}
                            valueLabelDisplay="auto"
                            min={0}
                            max={20000}
                            sx={{ color: '#FFE600' }}
                        />
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', color: 'gray' }}>
                            <Typography>₹{priceRange[0]}</Typography>
                            <Typography>₹{priceRange[1]}</Typography>
                        </Box>
                    </Box>
                </Grid>

                {/* Product Grid */}
                <Grid item xs={12} md={9}>
                    <Box sx={{ mb: 2 }}>
                        <Typography variant="h4" sx={{ color: 'white', fontFamily: "'Playfair Display', serif" }}>
                            {categoryFilter === 'All' ? 'All Products' : `${categoryFilter}'s Collection`}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'gray' }}>{products.length} items found</Typography>
                    </Box>

                    <Grid container spacing={2}>
                        {products.map((p) => (
                            <Grid item xs={12} sm={6} md={4} key={p.id}>
                                <ProductCard
                                    product={p}
                                    onAddToCart={addToCart}
                                    onAskAI={(prod) => triggerAgentMessage(`Is ${prod.name} available in my size?`)}
                                />
                            </Grid>
                        ))}
                    </Grid>
                </Grid>
            </Grid>
        </Container>
    );
}
