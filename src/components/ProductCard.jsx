import React from "react";
import { Box, Typography, Button, Card, CardMedia, CardContent, CardActions } from "@mui/material";

export default function ProductCard({ product, onAddToCart }) {
  return (
    <Card sx={{ maxWidth: 280, m: 1, borderRadius: 3, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
      <CardMedia
        component="img"
        height="200"
        image={product.image || "https://via.placeholder.com/200"} // Fallback image
        alt={product.name}
        sx={{ objectFit: "cover" }}
      />
      <CardContent sx={{ pb: 1 }}>
        <Typography gutterBottom variant="h6" component="div" sx={{ fontSize: "1rem", fontWeight: 600 }}>
          {product.name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {product.category}
        </Typography>
        <Typography variant="h6" color="primary" sx={{ mt: 1, fontWeight: 700 }}>
          ₹{product.price}
        </Typography>
      </CardContent>
      <CardActions sx={{ p: 2, pt: 0 }}>
        <Button
          size="small"
          variant="contained"
          fullWidth
          onClick={() => onAddToCart(product)}
          sx={{
            bgcolor: "var(--ey-yellow)",
            color: "black",
            "&:hover": { bgcolor: "var(--accent-gold-hover)" },
            textTransform: "none",
            borderRadius: 2,
            fontWeight: "bold"
          }}
        >
          Add to Cart
        </Button>
      </CardActions>
    </Card>
  );
}
