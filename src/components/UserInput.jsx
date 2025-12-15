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
      elevation={3}
      sx={{
        p: "2px 4px",
        display: "flex",
        alignItems: "center",
        width: "100%",
        borderRadius: 50,
        border: "6px solid #295ead20",
        boxShadow: "0 6px 50px rgba(0, 0, 0, 0.87)"
      }}
    >
      <TextField
      text-color="red"
        sx={{ ml: 1, flex: 1 }}
        placeholder="Type your message..."
        variant="standard"
        InputProps={{ disableUnderline: true }}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSend()}
      />
      <IconButton
        color="primary"
        sx={{ p: "10px", color: "var(--primary-color)" }}
        onClick={handleSend}
      >
        <SendRoundedIcon />
      </IconButton>
    </Paper>
  );
}
