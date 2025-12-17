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
    const { setCart, setIsCartOpen } = useCart();

    // Load messages from localStorage or use default greeting
    const [messages, setMessages] = useState(() => {
        const savedMessages = localStorage.getItem(`abfrl_chat_${sessionId}`);
        if (savedMessages) {
            try {
                return JSON.parse(savedMessages);
            } catch (e) {
                console.error("Failed to parse saved messages:", e);
            }
        }
        return [
            { role: "agent", message: "Hi! I'm your ABFRL Assistant. Looking for something specific?", products: [] }
        ];
    });

    const [isTyping, setIsTyping] = useState(false);
    // const [isListening, setIsListening] = useState(false); // Validated: Replaced by hook
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [language, setLanguage] = useState("en-IN");

    // MODE: text | voice
    const [inputMode, setInputMode] = useState("text");
    const [hasGreetedInVoiceMode, setHasGreetedInVoiceMode] = useState(false);

    const languageRef = useRef(language);
    const adaptersRef = useRef({});
    const messagesEndRef = useRef(null);

    useEffect(() => {
        languageRef.current = language;
    }, [language]);

    // Save messages to localStorage whenever they change
    useEffect(() => {
        localStorage.setItem(`abfrl_chat_${sessionId}`, JSON.stringify(messages));
    }, [messages, sessionId]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isTyping]);

    /* =========================
       AGENT RESPONSE HANDLER
    ========================= */
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
        setMessages(prev => [...prev, { role: "user", message: text, products: [] }]);
        await sendToAdapter(text, "text");
    };

    /* =========================
       VOICE RECOGNITION (CONTINUOUS)
    ========================= */
    const { isListening, startListening, stopListening } = useVoiceRecognition(language, async (spokenText) => {
        if (!spokenText) return;

        setInputMode("voice");

        // Send to adapter - handleAgentReply will manage recognition restart
        await sendToAdapter(spokenText, "voice");
    });

    /* =========================
       AGENT RESPONSE HANDLER
    ========================= */
    const handleAgentReply = async (response) => {
        setIsTyping(false);
        setLastAgentResponse(response);

        const agentMessage = {
            role: "agent",
            message: response.reply || "",
            products:
                response.action === "SHOW_PRODUCTS" &&
                    response.target === "AgentPanel" &&
                    response.products?.length
                    ? response.products
                    : []
        };

        setMessages(prev => [...prev, agentMessage]);

        // 🔊 Handle voice mode
        if (inputMode === "voice") {
            // STOP listening before speaking to avoid feedback/browser issues
            stopListening();

            if (response.reply) {
                setIsSpeaking(true);

                // Speak and wait for completion
                await speak(response.reply, languageRef.current);

                setIsSpeaking(false);

                // Resume listening after agent finishes speaking
                // Small delay to ensure synthesis is fully teardown
                setTimeout(() => {
                    console.log("Resuming listening after agent reply...");
                    startListening();
                }, 100);
            } else {
                // Agent has no speech; just restart listening immediately
                setTimeout(() => {
                    startListening();
                }, 100);
            }
        }

        if (response.cart) {
            setCart(response.cart);
        }

        if (response.action === "ADD_TO_CART_CONFIRMED") {
            // Force open cart sidebar so user sees the addition
            setIsCartOpen(true);
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


    const toggleListening = async () => {
        if (isListening) {
            stopListening();
            window.speechSynthesis.cancel(); // Stop any ongoing speech
        } else {
            setInputMode("voice");

            // 🔊 Greet user when voice mode is activated (only first time)
            if (!hasGreetedInVoiceMode) {
                const greetingMessage = "Hello! I'm listening. How can I help you today?";

                // Add greeting to chat (optional visual feedback)
                const greetingMsg = {
                    role: "agent",
                    message: greetingMessage,
                    products: []
                };
                setMessages(prev => [...prev, greetingMsg]);
                setHasGreetedInVoiceMode(true);

                // Speak greeting and wait for it to finish
                setIsSpeaking(true);
                await speak(greetingMessage, languageRef.current);
                setIsSpeaking(false);

                // Start listening after greeting finishes
                setTimeout(() => {
                    startListening();
                }, 300);
            } else {
                // No greeting, start listening immediately
                startListening();
            }
        }
    };

    /* =========================
       CLEAR CHAT
    ========================= */
    const handleClearChat = () => {
        if (!window.confirm("Are you sure you want to clear the chat?")) return;

        stopListening();
        clearSession();

        // Clear messages from state
        setMessages([
            { role: "agent", message: "Hi! I'm your ABFRL Assistant. Looking for something specific?", products: [] }
        ]);

        // Clear messages from localStorage
        localStorage.removeItem(`abfrl_chat_${sessionId}`);

        setIsTyping(false);
        setIsListening(false);
        setInputMode("text");
        setHasGreetedInVoiceMode(false); // Reset greeting flag
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
                    <Box key={i} mb={2}>
                        <MessageBubble message={msg.message} role={msg.role} />

                        {msg.products?.length > 0 && (
                            <Box mt={1}>
                                <Typography variant="caption" sx={{ color: "gold" }}>
                                    Recommended Products
                                </Typography>
                                {msg.products.map((p) => (
                                    <ProductCard key={p.sku} product={p} compact />
                                ))}
                            </Box>
                        )}
                    </Box>
                ))}

                {isTyping && (
                    <Typography variant="caption" sx={{ color: "#888" }}>
                        Agent is typing…
                    </Typography>
                )}

                {isSpeaking && (
                    <Typography variant="caption" sx={{ color: "gold" }}>
                        🔊 Agent is speaking…
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
                    // disabled={isListening} // Don't block input
                    placeholder="Ask me anything…"
                    dense
                />
            </Box>
        </Box>
    );
}
