import React, { useState, useEffect, useRef } from "react";
import { Box, IconButton, Typography, AppBar, Toolbar, Badge, Container, Fade } from "@mui/material";
import MicIcon from "@mui/icons-material/Mic";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import MenuIcon from "@mui/icons-material/Menu";
import MessageBubble from "./MessageBubble.jsx";
import UserInput from "./UserInput.jsx";
import ChannelSelector from "./ChannelSelector.jsx";
import CartDrawer from "./CartDrawer.jsx";
import ProductCard from "./ProductCard.jsx";
import { useSession } from "../context/SessionContext.jsx";
import { VoiceAdapter } from "../channels/voice.adapter.js";
import { WebAdapter } from "../channels/web.adapter.js";
import { WhatsAppAdapter } from "../channels/whatsapp.adapter.js";
import { KioskAdapter } from "../channels/kiosk.adapter.js";

export default function ChatWindow() {
  const { sessionId, setSessionId, channel, setChannel } = useSession();
  const [messages, setMessages] = useState([{ role: "agent", message: "Welcome to ABFRL! How can I assist you today?" }]);
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [voiceAdapter, setVoiceAdapter] = useState(null);
  const [isTyping, setIsTyping] = useState(false);

  const adaptersRef = useRef({});
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const handleAgentReply = (response) => {
      setIsTyping(false);

      // Handle text reply
      if (response.reply) {
        setMessages((prev) => [...prev, { role: "agent", message: response.reply }]);
        voiceAdapter?.speak(response.reply);
      }

      // Handle cart updates
      if (response.cart) {
        setCart((prevCart) => {
          // Check for new items to display in chat
          const newItems = response.cart.filter(item => !prevCart.some(p => p.sku === item.sku));
          if (newItems.length > 0) {
            newItems.forEach(item => {
              setMessages(prev => [...prev, { role: "system", type: "product", data: item }]);
            });
          }
          return response.cart;
        });
      }
    };

    adaptersRef.current = {
      web: new WebAdapter(handleAgentReply),
      whatsapp: new WhatsAppAdapter(handleAgentReply),
      kiosk: new KioskAdapter(handleAgentReply),
    };

    const vAdapter = new VoiceAdapter(handleVoiceInput, (text) => console.log("Agent says:", text));
    setVoiceAdapter(vAdapter);
  }, []);

  const handleVoiceInput = async (text) => {
    addUserMessage(text);
    await sendToAdapter(text);
  };

  const addUserMessage = (text) => {
    setMessages((prev) => [...prev, { role: "user", message: text }]);
  };

  const sendToAdapter = async (text) => {
    setIsTyping(true);
    const currentAdapter = adaptersRef.current[channel];
    if (currentAdapter) {
      await currentAdapter.send(text, sessionId);
    } else {
      console.error("Adapter not found for channel:", channel);
      setIsTyping(false);
    }
  };

  const handleSend = async (text) => {
    addUserMessage(text);
    await sendToAdapter(text);
  };

  const handleCheckout = () => {
    handleSend("I want to checkout");
    setIsCartOpen(false);
  };

  return (
    <Box sx={{ height: "100vh", display: "flex", flexDirection: "column", bgcolor: "#f1f5f9" }}>
      {/* Header */}
      <AppBar position="static" elevation={0} sx={{ bgcolor: "var(--primary-color)", color: "white" }}>
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 600 }}>
            ABFRL Sales Assistant
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <ChannelSelector current={channel} onChange={setChannel} />
            <IconButton color="inherit" onClick={() => setIsCartOpen(true)}>
              <Badge badgeContent={cart.length} color="secondary">
                <ShoppingBagIcon />
              </Badge>
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Chat Area */}
      <Container maxWidth="md" sx={{ flexGrow: 1, overflow: "hidden", display: "flex", flexDirection: "column", py: 2 }}>
        <Box sx={{ flexGrow: 1, overflowY: "auto", px: 2, display: "flex", flexDirection: "column" }}>
          {messages.map((msg, idx) => {
            if (msg.type === "product") {
              return (
                <Fade in={true} key={idx}>
                  <Box display="flex" justifyContent="flex-start" mb={2}>
                    <ProductCard product={msg.data} onAddToCart={() => { }} />
                  </Box>
                </Fade>
              );
            }
            return <MessageBubble key={idx} message={msg.message} role={msg.role} />;
          })}
          {isTyping && (
            <Typography variant="caption" sx={{ ml: 2, color: "text.secondary", fontStyle: "italic" }}>
              Agent is typing...
            </Typography>
          )}
          <div ref={messagesEndRef} />
        </Box>

        {/* Input Area */}
        <Box sx={{ pt: 2 }}>
          <Box display="flex" gap={1} alignItems="center">
            <UserInput onSend={handleSend} />
            <IconButton
              sx={{
                bgcolor: "white",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                "&:hover": { bgcolor: "#f8fafc" }
              }}
              onClick={() => voiceAdapter?.startListening()}
            >
              <MicIcon color="action" />
            </IconButton>
          </Box>
        </Box>
      </Container>

      <CartDrawer
        open={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onCheckout={handleCheckout}
      />
    </Box>
  );
}
