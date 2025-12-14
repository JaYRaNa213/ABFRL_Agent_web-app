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
        <Avatar sx={{ bgcolor: "var(--secondary-color)", width: 32, height: 32 }}>
          <SmartToyIcon fontSize="small" />
        </Avatar>
      )}

      <Paper
        elevation={0}
        sx={{
          p: 2,
          backgroundColor: isUser ? "var(--chat-bg-user)" : "var(--chat-bg-agent)",
          color: isUser ? "var(--chat-text-user)" : "var(--chat-text-agent)",
          maxWidth: "70%",
          borderRadius: isUser ? "20px 20px 4px 20px" : "20px 20px 20px 4px",
          boxShadow: isUser ? "none" : "0 2px 8px rgba(0,0,0,0.05)",
          border: isUser ? "none" : "1px solid #e2e8f0"
        }}
      >
        <Typography variant="body1" sx={{ whiteSpace: "pre-wrap" }}>
          {message}
        </Typography>
      </Paper>

      {isUser && (
        <Avatar sx={{ bgcolor: "var(--accent-color)", width: 32, height: 32 }}>
          <PersonIcon fontSize="small" />
        </Avatar>
      )}
    </Box>
  );
}
