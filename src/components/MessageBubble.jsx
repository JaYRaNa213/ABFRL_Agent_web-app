import React from "react";
import { Box, Paper, Typography, Avatar } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import SmartToyIcon from "@mui/icons-material/SmartToy";

export default function MessageBubble({ message, role }) {
  const isUser = role === "user";

  return (
    <Box
      display="flex"
      justifyContent={isUser ? "flex-end" : "flex-start"}
      mb={2}
      gap={1}
      className="fade-in"
    >
      {!isUser && (
        <Avatar sx={{ bgcolor: "var(--ey-yellow)", color: "black", width: 32, height: 32 }}>
          <SmartToyIcon fontSize="small" />
        </Avatar>
      )}

      <Paper
        elevation={0}
        sx={{
          p: 2,
          backgroundColor: isUser ? "var(--ey-yellow)" : "rgba(255, 255, 255, 0.08)",
          color: isUser ? "black" : "var(--ey-white)",
          maxWidth: "70%",
          borderRadius: isUser ? "20px 20px 4px 20px" : "20px 20px 20px 4px",
          border: isUser ? "none" : "1px solid var(--border-glass)",
          fontWeight: 500
        }}
      >
        <Typography variant="body1" sx={{ whiteSpace: "pre-wrap" }}>
          {message}
        </Typography>
      </Paper>

      {isUser && (
        <Avatar sx={{ bgcolor: "var(--ey-gray-medium)", color: "var(--ey-white)", width: 32, height: 32 }}>
          <PersonIcon fontSize="small" />
        </Avatar>
      )}
    </Box>
  );
}
