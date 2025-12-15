import React from 'react';
import { Box, Typography, Container, Paper, Grid, Avatar, List, ListItem, ListItemText, Divider, Chip } from '@mui/material';
import customersData from '../../data/customers.json';

export default function Profile() {
    const user = customersData[0]; // Mock user

    return (
        <Container maxWidth="lg" sx={{ py: 6 }}>
            <Grid container spacing={4}>
                {/* Sidebar Info */}
                <Grid item xs={12} md={4}>
                    <Paper sx={{ p: 4, bgcolor: '#1e1e1e', color: 'white', textAlign: 'center' }}>
                        <Avatar sx={{ width: 100, height: 100, bgcolor: '#FFE600', color: 'black', fontSize: 40, mx: 'auto', mb: 2 }}>
                            {user.name[0]}
                        </Avatar>
                        <Typography variant="h5" gutterBottom>{user.name}</Typography>
                        <Typography variant="body2" color="gray" gutterBottom>{user.email}</Typography>
                        <Chip label={user.loyaltyTier} sx={{ bgcolor: '#FFE600', color: 'black', fontWeight: 'bold', mt: 1 }} />

                        <Box sx={{ mt: 4, textAlign: 'left' }}>
                            <Typography variant="overline" color="gray">MEMBER SINCE</Typography>
                            <Typography>2021</Typography>

                            <Typography variant="overline" color="gray" sx={{ display: 'block', mt: 2 }}>LOYALTY POINTS</Typography>
                            <Typography variant="h4" sx={{ color: '#FFE600' }}>{user.loyaltyPoints}</Typography>
                        </Box>
                    </Paper>
                </Grid>

                {/* Details */}
                <Grid item xs={12} md={8}>
                    <Paper sx={{ p: 4, bgcolor: '#1e1e1e', color: 'white' }}>
                        <Typography variant="h6" sx={{ mb: 3 }}>Style Preferences</Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <Typography color="gray">Preferred Style</Typography>
                                <Typography variant="h6">{user.preferences.style}</Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography color="gray">Top Brands</Typography>
                                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1 }}>
                                    {user.preferences.brands.map(b => (
                                        <Chip key={b} label={b} variant="outlined" sx={{ color: 'white', borderColor: 'gray' }} />
                                    ))}
                                </Box>
                            </Grid>
                        </Grid>

                        <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)', my: 4 }} />

                        <Typography variant="h6" sx={{ mb: 3 }}>Recent Orders</Typography>
                        <List>
                            <ListItem sx={{ bgcolor: 'rgba(255,255,255,0.05)', borderRadius: 2, mb: 1 }}>
                                <ListItemText
                                    primary="Order #ABFRL-9821"
                                    secondary={<Typography variant="body2" color="gray">Delivered on Oct 15, 2024</Typography>}
                                />
                                <Typography sx={{ color: '#4CAF50' }}>Delivered</Typography>
                            </ListItem>
                            <ListItem sx={{ bgcolor: 'rgba(255,255,255,0.05)', borderRadius: 2 }}>
                                <ListItemText
                                    primary="Order #ABFRL-4522"
                                    secondary={<Typography variant="body2" color="gray">Delivered on Sep 02, 2024</Typography>}
                                />
                                <Typography sx={{ color: '#4CAF50' }}>Delivered</Typography>
                            </ListItem>
                        </List>
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
}
