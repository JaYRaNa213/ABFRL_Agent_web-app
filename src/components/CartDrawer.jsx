import React from "react";
import { Drawer, Box, Typography, List, ListItem, ListItemText, Divider, Button, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";

export default function CartDrawer({ open, onClose, cart, onCheckout }) {
    const total = cart.reduce((sum, item) => sum + item.price, 0);

    return (
        <Drawer anchor="right" open={open} onClose={onClose}>
            <Box sx={{ width: 320, p: 3, height: "100%", display: "flex", flexDirection: "column" }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <Box display="flex" alignItems="center" gap={1}>
                        <ShoppingBagIcon color="primary" />
                        <Typography variant="h6" fontWeight="bold">Your Cart</Typography>
                    </Box>
                    <IconButton onClick={onClose}>
                        <CloseIcon />
                    </IconButton>
                </Box>

                <Divider />

                <List sx={{ flexGrow: 1, overflow: "auto" }}>
                    {cart.length === 0 ? (
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 2, textAlign: "center" }}>
                            Your cart is empty.
                        </Typography>
                    ) : (
                        cart.map((item, index) => (
                            <ListItem key={index} sx={{ px: 0 }}>
                                <ListItemText
                                    primary={item.name}
                                    secondary={`₹${item.price}`}
                                    primaryTypographyProps={{ fontWeight: 500 }}
                                />
                            </ListItem>
                        ))
                    )}
                </List>

                <Divider sx={{ my: 2 }} />

                <Box mb={2}>
                    <Box display="flex" justifyContent="space-between" mb={1}>
                        <Typography>Subtotal</Typography>
                        <Typography fontWeight="bold">₹{total}</Typography>
                    </Box>
                </Box>

                <Button
                    variant="contained"
                    fullWidth
                    size="large"
                    disabled={cart.length === 0}
                    onClick={onCheckout}
                    sx={{
                        bgcolor: "var(--ey-yellow)",
                        color: "#000",
                        "&:hover": { bgcolor: "var(--accent-gold-hover)" },
                        fontWeight: "bold"
                    }}
                >
                    Checkout
                </Button>
            </Box>
        </Drawer>
    );
}
