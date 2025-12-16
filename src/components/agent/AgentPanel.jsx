import React, { useState, useEffect, useRef } from "react";
import { Box, IconButton, Typography, Avatar } from "@mui/material";
import MicIcon from "@mui/icons-material/Mic";
import GraphicEqIcon from "@mui/icons-material/GraphicEq";
import RefreshIcon from "@mui/icons-material/Refresh";

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
    const { sessionId, channel, setLastAgentResponse, clearSession } = useSession();
    const { setCart } = useCart();

    const [messages, setMessages] = useState([
        { role: "agent", message: "Hi! I'm your ABFRL Assistant. Looking for something specific?" }
    ]);

    const [displayedProducts, setDisplayedProducts] = useState([]);
    const [isTyping, setIsTyping] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [language, setLanguage] = useState("en-IN");

    // MODE: text | voice
    const [inputMode, setInputMode] = useState("text");

    const languageRef = useRef(language);
    const adaptersRef = useRef({});
    const messagesEndRef = useRef(null);

    useEffect(() => {
        languageRef.current = language;
    }, [language]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isTyping, displayedProducts]);

    /* =========================
       AGENT RESPONSE HANDLER
    ========================= */
    const handleAgentReply = (response) => {
        setIsTyping(false);
        setLastAgentResponse(response);

        // TEXT RESPONSE (both modes)
        if (response.reply) {
            setMessages((prev) => [...prev, { role: "agent", message: response.reply }]);
        }

        // 🔊 SPEAK ONLY IN VOICE MODE
        if (inputMode === "voice" && response.reply) {
            speak(response.reply, languageRef.current);
        }

        // 🛍️ SHOW PRODUCTS IN BOTH MODES
        if (
            response.action === "SHOW_PRODUCTS" &&
            response.target === "AgentPanel" &&
            response.products?.length
        ) {
            setDisplayedProducts(response.products);
        } else {
            setDisplayedProducts([]);
        }

        if (response.cart) {
            setCart(response.cart);
        }
    };

    /* =========================
       ADAPTER SETUP
    ========================= */
    useEffect(() => {
        adaptersRef.current = {
            web: new WebAdapter(handleAgentReply),
            whatsapp: new WhatsAppAdapter(handleAgentReply),
            kiosk: new KioskAdapter(handleAgentReply),
        };
    }, []);

    /* =========================
       SEND TO ADAPTER
    ========================= */
    const sendToAdapter = async (text, mode) => {
        setIsTyping(true);
        const adapter = adaptersRef.current[channel] || adaptersRef.current.web;

        await adapter.send(text, sessionId, {
            language,
            inputMode: mode,
            channel,
        });
    };

    /* =========================
       TEXT SEND
    ========================= */
    const handleSendText = async (text) => {
    if (!text) return;

    setInputMode("text");
    setMessages(prev => [...prev, { role: "user", message: text }]);
    await sendToAdapter(text, "text");
};


    /* =========================
       VOICE RECOGNITION (CONTINUOUS)
    ========================= */
    const recognition = useVoiceRecognition(language, async (spokenText) => {
    if (!spokenText) return;

    setInputMode("voice");

    // ❌ DO NOT add spokenText to messages

    await sendToAdapter(spokenText, "voice");

    // 🔁 restart listening
    if (isListening) {
        setTimeout(() => recognition.start(), 500);
    }
});


    const toggleListening = () => {
        if (isListening) {
            recognition.stop();
            setIsListening(false);
        } else {
            setInputMode("voice");
            setIsListening(true);
            recognition.start();
        }
    };

    /* =========================
       CLEAR CHAT
    ========================= */
    const handleClearChat = () => {
        if (!window.confirm("Are you sure you want to clear the chat?")) return;

        recognition.stop();
        clearSession();

        setMessages([
            { role: "agent", message: "Hi! I'm your ABFRL Assistant. Looking for something specific?" }
        ]);
        setDisplayedProducts([]);
        setIsTyping(false);
        setIsListening(false);
        setInputMode("text");
    };

    return (
        <Box sx={{ height: "100%", display: "flex", flexDirection: "column", bgcolor: "#1e1e1e" }}>
            {/* HEADER */}
            <Box sx={{ p: 2, display: "flex", justifyContent: "space-between", bgcolor: "#252526" }}>
                <Box display="flex" alignItems="center" gap={1}>
                    <Avatar sx={{ bgcolor: "gold", width: 24, height: 24 }}>AI</Avatar>
                    <Typography sx={{ color: "#fff", fontWeight: 600 }}>ABFRL Agent</Typography>
                </Box>
                <Box display="flex" alignItems="center" gap={1}>
                    <Typography variant="caption" sx={{ color: "gold" }}>
                        {inputMode === "voice" ? "Voice mode" : "Text mode"}
                    </Typography>
                    <LanguageSelector language={language} setLanguage={setLanguage} />
                    <IconButton onClick={handleClearChat} size="small" sx={{ color: "gold" }}>
                        <RefreshIcon fontSize="small" />
                    </IconButton>
                </Box>
            </Box>

            {/* CHAT */}
            <Box sx={{ flexGrow: 1, overflowY: "auto", p: 2 }}>
                {messages.map((msg, i) => (
                    <MessageBubble key={i} message={msg.message} role={msg.role} />
                ))}

                {displayedProducts.length > 0 && (
                    <Box mt={2}>
                        <Typography variant="caption" sx={{ color: "gold" }}>
                            Recommended Products
                        </Typography>
                        {displayedProducts.map((p) => (
                            <ProductCard key={p.sku} product={p} compact />
                        ))}
                    </Box>
                )}

                {isTyping && (
                    <Typography variant="caption" sx={{ color: "#888" }}>
                        Agent is typing…
                    </Typography>
                )}
                <div ref={messagesEndRef} />
            </Box>

            {/* INPUT */}
            <Box sx={{ p: 2, display: "flex", gap: 1, bgcolor: "#252526" }}>
                <IconButton onClick={toggleListening} sx={{ color: isListening ? "gold" : "gray" }}>
                    {isListening ? <GraphicEqIcon /> : <MicIcon />}
                </IconButton>
                <UserInput
                    onSend={handleSendText}
                    disabled={isListening}
                    placeholder="Ask me anything…"
                    dense
                />
            </Box>
        </Box>
    );
}
