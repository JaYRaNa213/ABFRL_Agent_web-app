import React, { useState, useEffect, useRef } from "react";
import { Box, IconButton, Typography, Avatar, Fade, Paper } from "@mui/material";
import MicIcon from "@mui/icons-material/Mic";
import GraphicEqIcon from '@mui/icons-material/GraphicEq';
import MessageBubble from "../MessageBubble.jsx";
import UserInput from "../UserInput.jsx";
import ProductCard from "../ProductCard.jsx";
import { useSession } from "../../context/SessionContext.jsx";
import { useCart } from "../../context/CartContext.jsx"; // Import CartContext
import { WebAdapter } from "../../channels/web.adapter.js";
import { WhatsAppAdapter } from "../../channels/whatsapp.adapter.js";
import { KioskAdapter } from "../../channels/kiosk.adapter.js";
import LanguageSelector from "../LanguageSelector.jsx";
import { useVoiceRecognition } from "../../hooks/useVoiceRecognition.js";
import { speak } from "../../utils/speak.js";

export default function AgentPanel() {
    const { sessionId, channel } = useSession();
    const { setCart } = useCart();
    const [messages, setMessages] = useState([{ role: "agent", message: "Hi! I'm your ABFRL Assistant. Looking for something specific?" }]);
    const [isTyping, setIsTyping] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [language, setLanguage] = useState("en-IN");

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
    }, [messages, isTyping]);

    useEffect(() => {
        const handleAgentReply = (response) => {
            setIsTyping(false);

            if (response.reply) {
                setMessages((prev) => [...prev, { role: "agent", message: response.reply }]);
                speak(response.reply, languageRef.current);
            }

            if (response.cart) {
                setCart((prevCart) => {
                    // Logic to merge cart items or overwrite. 
                    // For simplicity in this demo, we'll append new ones or just set it if backend sends full cart
                    // The prompt says "Agent returns... Optional product suggestions". 
                    // If the agent updates cart, we assume it sends the updated cart or items to add.
                    // Let's assume it sends items to add for now or full cart state.
                    // Existing logic from ChatWindow:
                    const newItems = response.cart.filter(item => !prevCart.some(p => p.sku === item.sku));
                    if (newItems.length > 0) {
                        newItems.forEach(item => {
                            setMessages(prev => [...prev, { role: "system", type: "product", data: item }]);
                        });
                    }
                    return response.cart; // This replaces the cart.
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
