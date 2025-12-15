import React from "react";
import { Typography, Button, Card, CardMedia, CardContent, CardActions, Chip } from "@mui/material";

export default function ProductCard({ product, onAddToCart, onAskAI, compact = false }) {
  // Handle price display defensively
  const price = typeof product.price === 'number' ? product.price.toLocaleString('en-IN') : product.price;

  return (
    <Card
      sx={{
        width: compact ? 200 : { xs: "100%", sm: 280 },
        maxWidth: "100%",
        m: 1,
        bgcolor: "#1e1e1e",
        color: "white",
        borderRadius: 3,
        border: "1px solid rgba(255,255,255,0.05)",
        boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
        transition: "transform 0.2s, box-shadow 0.2s",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: "0 10px 20px rgba(0,0,0,0.5)"
        }
      }}
    >
      <CardMedia
        component="img"
        height={compact ? "140" : "280"}
        image={product.image || "https://via.placeholder.com/200"}
        alt={product.name}
        sx={{ objectFit: "cover" }}
      />
      <CardContent sx={{ pb: 1, p: compact ? 1.5 : 2 }}>
        {product.subCategory && !compact && (
          <Typography variant="overline" color="gray" sx={{ lineHeight: 1 }}>{product.category} • {product.subCategory}</Typography>
        )}
        <Typography
          gutterBottom
          variant={compact ? "subtitle2" : "h6"}
          component="div"
          sx={{
            fontWeight: 600,
            fontFamily: "'Outfit', sans-serif",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis"
          }}
        >
          {product.name}
        </Typography>

        <Typography variant={compact ? "subtitle2" : "h6"} sx={{ color: "#FFE600", fontWeight: 700 }}>
          ₹{price}
        </Typography>
      </CardContent>

      {!compact && (
        <CardActions sx={{ p: 2, pt: 0 }}>
          <Button
            size="small"
            variant="outlined"
            fullWidth
            onClick={() => onAddToCart && onAddToCart(product)}
            sx={{
              borderColor: "#FFE600",
              color: "#FFE600",
              "&:hover": { bgcolor: "rgba(255, 230, 0, 0.1)", borderColor: "#FFE600" },
              textTransform: "none",
              borderRadius: 2,
              fontWeight: "bold"
            }}
          >
            Add to Cart
          </Button>
          {onAskAI && (
            <Button
              size="small"
              variant="text"
              fullWidth
              onClick={(e) => { e.stopPropagation(); onAskAI(product); }}
              sx={{ mt: 1, color: "gray", fontSize: "0.75rem", textTransform: "none" }}
            >
              Ask AI about this
            </Button>
          )}
        </CardActions>
      )}
    </Card>
  );
}
