import React, { useState } from "react";
import { Box, TextField, IconButton, Paper } from "@mui/material";
import SendRoundedIcon from "@mui/icons-material/SendRounded";

export default function UserInput({ onSend }) {
  const [text, setText] = useState("");

  const handleSend = () => {
    if (text.trim() === "") return;
    onSend(text);
    setText("");
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: "2px 4px",
        display: "flex",
        alignItems: "center",
        width: "100%",
        borderRadius: 50,
        bgcolor: "transparent",
        border: "none",
        boxShadow: "none"
      }}
    >
      <TextField
        fullWidth
        sx={{
          ml: 1,
          flex: 1,
          "& input": { color: "var(--ey-white)", fontSize: "1rem" },
          "& ::placeholder": { color: "var(--ey-gray-muted) !important", opacity: 1 }
        }}
        placeholder="Type a message..."
        variant="standard"
        InputProps={{ disableUnderline: true }}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSend()}
      />

      <IconButton
        onClick={handleSend}
        disabled={!text.trim()}
        sx={{
          color: "var(--ey-yellow)",
          "&:disabled": { color: "rgba(255, 255, 255, 0.1)" }
        }}
      >
        <SendRoundedIcon />
      </IconButton>
    </Paper>
  );
}
