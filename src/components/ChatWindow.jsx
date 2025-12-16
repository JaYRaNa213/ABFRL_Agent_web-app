import React, { useState, useEffect, useRef } from "react";
import { Box, IconButton, Typography, AppBar, Toolbar, Badge, Container, Fade, Avatar, Paper } from "@mui/material";
import MicIcon from "@mui/icons-material/Mic";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import GraphicEqIcon from '@mui/icons-material/GraphicEq';
import MessageBubble from "./MessageBubble.jsx";
import UserInput from "./UserInput.jsx";
import ProductCard from "./ProductCard.jsx";
import CartDrawer from "./CartDrawer.jsx";
import { useSession } from "../context/SessionContext.jsx";
import { WebAdapter } from "../channels/web.adapter.js";
import { WhatsAppAdapter } from "../channels/whatsapp.adapter.js";
import { KioskAdapter } from "../channels/kiosk.adapter.js";
import LanguageSelector from "./LanguageSelector.jsx";
import { useVoiceRecognition } from "../hooks/useVoiceRecognition.js";
import { speak } from "../utils/speak.js";

export default function ChatWindow() {
  const { sessionId, channel } = useSession();
  const [messages, setMessages] = useState([{ role: "agent", message: "Welcome to ABFRL! I'm your personal shopping assistant. How can I distinguish your style today?" }]);
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [language, setLanguage] = useState("en-IN");

  const languageRef = useRef(language);

  useEffect(() => {
    languageRef.current = language;
  }, [language]);

  const adaptersRef = useRef({});
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    const handleAgentReply = (response) => {
      console.log("🔍 FRONTEND: Received response:", response);
      setIsTyping(false);

      if (response.reply) {
        setMessages((prev) => [...prev, { role: "agent", message: response.reply }]);
        speak(response.reply, languageRef.current);
      }

      // Handle "SHOW_PRODUCTS" action strict protocol
      if (response.action === "SHOW_PRODUCTS" && response.products && response.products.length > 0) {
        console.log("✅ SHOW_PRODUCTS action detected, products:", response.products.length);
        const productMessages = response.products.map(product => ({
          role: "system",
          type: "product",
          data: product
        }));

        // Add product cards immediately
        setMessages(prev => [...prev, ...productMessages]);
        console.log("📦 Added product messages to state");

        // If there's no text reply (which is expected for SHOW_PRODUCTS), we are done.
        // The check below for response.reply handles the case where text MIGHT be sent (fallback).
      }
      // Legacy or Hybrid support: if products are sent without strict action (or different action)
      else if (response.products && response.products.length > 0) {
        console.log("⚠️ Products without SHOW_PRODUCTS action, products:", response.products.length);
        const productMessages = response.products.map(product => ({
          role: "system",
          type: "product",
          data: product
        }));
        setMessages(prev => [...prev, ...productMessages]);
      } else {
        console.log("❌ No products in response");
      }

      if (response.cart) {
        setCart((prevCart) => {
          const newItems = response.cart.filter(item => !prevCart.some(p => p.sku === item.sku));
          if (newItems.length > 0) {
            newItems.forEach(item => {
              // Optional: notify about cart addition if needed, or just let the drawer update
              // For now, we rely on the drawer badge
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

    // Restore History
    const fetchHistory = async () => {
      const history = await adaptersRef.current.web.getHistory(sessionId);
      if (history.conversationHistory && history.conversationHistory.length > 0) {
        setMessages(
          history.conversationHistory.map((h) => ({
            role: h.role,
            message: h.message
          }))
        );
      }
      if (history.cart) setCart(history.cart);
    };
    fetchHistory();

    fetchHistory();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const recognition = useVoiceRecognition(language, (text) => handleSend(text, "voice"));

  const sendToAdapter = async (text, channelOverride) => {
    setIsTyping(true);
    const currentAdapter = adaptersRef.current[channel] || adaptersRef.current.web;
    await currentAdapter.send(text, sessionId, { language, channel: channelOverride || channel });
  };

  const handleSend = async (text, channelOverride) => {
    if (!text) return;
    setMessages((prev) => [...prev, { role: "user", message: text }]);
    await sendToAdapter(text, channelOverride);
  };

  const toggleListening = () => {
    if (isListening) {
      if (recognition) recognition.stop();
      setIsListening(false);
    } else {
      if (recognition) {
        setIsListening(true);
        recognition.start();
      }
    }
  };

  return (
    <Box sx={{ height: "100vh", display: "flex", flexDirection: "column", bgcolor: "var(--primary-dark)" }}>
      {/* Premium Header */}
      <AppBar position="static"
        sx={{
          bgcolor: "rgba(0, 0, 0, 0.8)",
          backdropFilter: "blur(12px)",
          boxShadow: "none",
          borderBottom: "1px solid var(--border-glass)"
        }}>
        <Toolbar sx={{ height: { xs: 60, md: 70 }, px: { xs: 1, md: 3 } }}>
          <IconButton edge="start" sx={{ color: "var(--text-light)", mr: 2 }}>
            <MenuRoundedIcon />
          </IconButton>

          <Box sx={{ flexGrow: 1, display: "flex", alignItems: "center", gap: 1.5 }}>
            <Avatar sx={{ bgcolor: "var(--accent-gold)", width: 32, height: 32, fontSize: 16, fontWeight: "bold" }}>A</Avatar>
            <Typography variant="h6" sx={{ fontFamily: "'Playfair Display', serif", color: "var(--accent-gold)", fontWeight: 600, letterSpacing: 0.5 }}>
              ABFRL <span style={{ color: "var(--accent-gold)", fontWeight: 300 }}>Assistant</span>
            </Typography>
            <LanguageSelector language={language} setLanguage={setLanguage} />
          </Box>

          <IconButton onClick={() => setIsCartOpen(true)} sx={{ color: "var(--text-light)" }}>
            <Badge badgeContent={cart.length} sx={{ "& .MuiBadge-badge": { bgcolor: "var(--accent-gold)", color: "black" } }}>
              <ShoppingBagOutlinedIcon />
            </Badge>
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Chat Canvas */}
      <Container maxWidth="md" sx={{ flexGrow: 1, overflow: "hidden", display: "flex", flexDirection: "column", py: { xs: 1, md: 3 }, px: { xs: 1, md: 2 } }}>
        <Box sx={{ flexGrow: 1, overflowY: "auto", px: { xs: 1, md: 2 }, display: "flex", flexDirection: "column", gap: 2 }}>
          {messages.map((msg, idx) => (
            <React.Fragment key={idx}>
              {msg.type === "product" ? (
                <Fade in={true} timeout={500}>
                  <Box display="flex" justifyContent="flex-start" sx={{ maxWidth: "85%" }}>
                    <ProductCard product={msg.data} />
                  </Box>
                </Fade>
              ) : (
                <MessageBubble message={msg.message} role={msg.role} />
              )}
            </React.Fragment>
          ))}

          {isTyping && (
            <Fade in={true}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, ml: 1, mt: 1 }}>
                <Avatar sx={{ width: 24, height: 24, bgcolor: "var(--accent-gold)" }} src="/ai-avatar-placeholder.png" >A</Avatar>
                <Typography variant="caption" sx={{ color: "var(--text-muted)" }}>Thinking...</Typography>
              </Box>
            </Fade>
          )}
          <div ref={messagesEndRef} />
        </Box>

        {/* Floating Input Area */}
        <Box sx={{ pt: 3, position: "relative", px: 1, pb: 2 }}>
          <Box sx={{
            display: "flex",
            alignItems: "center",
            gap: { xs: 1, md: 2 },
            p: { xs: 1, md: 1.5 },
            borderRadius: "50px",
            bgcolor: "var(--ey-gray-dark)",
            border: "1px solid var(--ey-border)",
            boxShadow: "var(--shadow-card)"
          }}>
            {/* Big Visible Mic Button */}
            <IconButton
              onClick={toggleListening}
              sx={{
                bgcolor: isListening ? "var(--ey-yellow)" : "rgba(255, 230, 0, 0.1)",
                color: isListening ? "black" : "var(--ey-yellow)",
                border: "2px solid",
                borderColor: isListening ? "transparent" : "var(--ey-yellow)",
                width: { xs: 48, md: 64 },
                height: { xs: 48, md: 64 },
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                animation: isListening ? "pulse-yellow 1.5s infinite" : "none",
                "&:hover": {
                  bgcolor: "var(--ey-yellow)",
                  color: "black",
                  transform: "scale(1.05)",
                  boxShadow: "0 0 20px rgba(255, 230, 0, 0.4)"
                }
              }}
            >
              {isListening ? <GraphicEqIcon sx={{ fontSize: { xs: 24, md: 32 } }} /> : <MicIcon sx={{ fontSize: { xs: 24, md: 32 } }} />}
            </IconButton>

            <Box sx={{ flexGrow: 1 }}>
              <UserInput onSend={handleSend} disabled={isListening} />
            </Box>
          </Box>

          {isListening && (
            <Typography
              variant="subtitle1"
              sx={{
                position: "absolute",
                bottom: -10,
                left: "50%",
                transform: "translateX(-50%)",
                color: "var(--ey-yellow)",
                fontWeight: 700,
                letterSpacing: 2,
                textShadow: "0 2px 10px rgba(0,0,0,0.5)"
              }}
            >
              LISTENING...
            </Typography>
          )}
        </Box>
      </Container>

      <CartDrawer
        open={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
      />
    </Box>
  );
}
