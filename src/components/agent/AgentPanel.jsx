import React, { useState, useEffect, useRef } from "react";
import { Box, IconButton, Typography, Avatar, Fade, Paper, Button } from "@mui/material";
import MicIcon from "@mui/icons-material/Mic";
import GraphicEqIcon from '@mui/icons-material/GraphicEq';
import RefreshIcon from '@mui/icons-material/Refresh';
import MessageBubble from "../MessageBubble.jsx";
import UserInput from "../UserInput.jsx";
import ProductCard from "../ProductCard.jsx";
import { useSession } from "../../context/SessionContext.jsx";
import { useCart } from "../../context/CartContext.jsx";
import { WebAdapter } from "../../channels/web.adapter.js";
import { WhatsAppAdapter } from "../../channels/whatsapp.adapter.js";
import { KioskAdapter } from "../../channels/kiosk.adapter.js";
import LanguageSelector from "../LanguageSelector.jsx";
import { useVoiceRecognition } from "../../hooks/useVoiceRecognition.js";
import { speak } from "../../utils/speak.js";

export default function AgentPanel() {
    const { sessionId, channel, lastAgentResponse, setLastAgentResponse, clearSession } = useSession();
    const { setCart } = useCart();
    const [messages, setMessages] = useState([{ role: "agent", message: "Hi! I'm your ABFRL Assistant. Looking for something specific?" }]);
    const [isTyping, setIsTyping] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [language, setLanguage] = useState("en-IN");
    const [displayedProducts, setDisplayedProducts] = useState([]);

    const languageRef = useRef(language);
    const adaptersRef = useRef({});
    const messagesEndRef = useRef(null);

    useEffect(() => {
        languageRef.current = language;
    }, [language]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping, displayedProducts]);

    useEffect(() => {
        const handleAgentReply = (response) => {
            console.log("🔍 AgentPanel received response:", response);
            setIsTyping(false);

            // Store response in SessionContext for event-driven updates
            setLastAgentResponse(response);

            if (response.reply) {
                setMessages((prev) => [...prev, { role: "agent", message: response.reply }]);
                speak(response.reply, languageRef.current);
            }

            // Handle SHOW_PRODUCTS action
            if (response.action === "SHOW_PRODUCTS" && response.target === "AgentPanel" && response.products?.length > 0) {
                console.log("✅ SHOW_PRODUCTS detected in AgentPanel, products:", response.products.length);
                setDisplayedProducts(response.products);
            } else {
                // Clear products if not showing
                setDisplayedProducts([]);
            }

            if (response.cart) {
                setCart((prevCart) => {
                    const newItems = response.cart.filter(item => !prevCart.some(p => p.sku === item.sku));
                    return response.cart;
                });
            }
        };

        adaptersRef.current = {
            web: new WebAdapter(handleAgentReply),
            whatsapp: new WhatsAppAdapter(handleAgentReply),
            kiosk: new KioskAdapter(handleAgentReply),
        };

        const fetchHistory = async () => {
            // Mock history fetch or real one
            const history = await adaptersRef.current.web.getHistory(sessionId);
            if (history?.conversationHistory?.length > 0) {
                setMessages(history.conversationHistory.map((h) => ({ role: h.role, message: h.message })));
            }
            if (history?.cart) setCart(history.cart);
        };
        fetchHistory();
        fetchHistory();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    // Listen for triggers from the Shop (e.g., "Ask AI" buttons)
    const { pendingMessage, triggerAgentMessage } = useSession();
    useEffect(() => {
        if (pendingMessage) {
            handleSend(pendingMessage);
            triggerAgentMessage(null); // Clear it
        }
    }, [pendingMessage]);

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

    const handleClearChat = () => {
        if (window.confirm("Are you sure you want to clear the chat?")) {
            // Clear local state
            setMessages([{ role: "agent", message: "Hi! I'm your ABFRL Assistant. Looking for something specific?" }]);
            setDisplayedProducts([]);
            setIsTyping(false);
            setIsListening(false);

            // Clear session context
            clearSession();

            // Stop any ongoing speech
            if (recognition) {
                recognition.stop();
            }

            console.log("✅ Chat cleared successfully");
        }
    };

    const toggleListening = () => {
        if (isListening) {
            recognition?.stop();
            setIsListening(false);
        } else {
            setIsListening(true);
            recognition?.start();
        }
    };

    return (
        <Box sx={{ height: "100%", display: "flex", flexDirection: "column", bgcolor: "#1e1e1e", borderLeft: "1px solid #333" }}>
            {/* Agent Header */}
            <Box sx={{
                p: 2,
                borderBottom: "1px solid rgba(255,255,255,0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                bgcolor: "#252526"
            }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Avatar sx={{ bgcolor: "var(--accent-gold)", width: 24, height: 24, fontSize: 12, color: "black", fontWeight: "bold" }}>AI</Avatar>
                    <Typography variant="subtitle2" sx={{ color: "#fff", fontWeight: 600 }}>ABFRL Agent</Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: "#4CAF50" }} /> {/* Online indicator */}
                    <LanguageSelector language={language} setLanguage={setLanguage} />
                    <IconButton
                        onClick={handleClearChat}
                        size="small"
                        sx={{
                            color: "var(--accent-gold)",
                            '&:hover': { bgcolor: "rgba(255, 230, 0, 0.1)" }
                        }}
                        title="Refresh Chat"
                    >
                        <RefreshIcon fontSize="small" />
                    </IconButton>
                </Box>
            </Box>

            {/* Messages Area */}
            <Box sx={{ flexGrow: 1, overflowY: "auto", p: 2, display: "flex", flexDirection: "column", gap: 2 }}>
                {messages.map((msg, idx) => (
                    <React.Fragment key={idx}>
                        {msg.type === "product" ? (
                            <Box display="flex" justifyContent="flex-start" sx={{ maxWidth: "100%" }}>
                                <ProductCard product={msg.data} compact={true} />
                            </Box>
                        ) : (
                            <MessageBubble message={msg.message} role={msg.role} />
                        )}
                    </React.Fragment>
                ))}

                {/* Product Cards Section - Event-driven display */}
                {displayedProducts.length > 0 && (
                    <Box sx={{ mt: 2 }}>
                        <Typography variant="caption" sx={{ color: "var(--accent-gold)", mb: 1, display: "block" }}>
                            Recommended Products
                        </Typography>
                        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                            {displayedProducts.map((product) => (
                                <ProductCard key={product.sku} product={product} compact={true} />
                            ))}
                        </Box>
                    </Box>
                )}

                {isTyping && (
                    <Typography variant="caption" sx={{ color: "var(--text-muted)", ml: 1 }}>Agent is typing...</Typography>
                )}
                <div ref={messagesEndRef} />
            </Box>

            {/* Input Area */}
            <Box sx={{ p: 2, borderTop: "1px solid rgba(255,255,255,0.1)", bgcolor: "#252526" }}>
                <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                    <IconButton onClick={toggleListening} size="small" sx={{ color: isListening ? "var(--accent-gold)" : "gray" }}>
                        {isListening ? <GraphicEqIcon /> : <MicIcon />}
                    </IconButton>
                    <Box sx={{ flexGrow: 1 }}>
                        <UserInput onSend={handleSend} disabled={isListening} placeholder="Ask me anything..." dense={true} />
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}
