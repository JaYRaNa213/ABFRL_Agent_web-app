import axios from "axios";
import { sendMessage } from "../api/chatService.js";

const API_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

export class WebAdapter {
  constructor(onReceive) {
    this.onReceive = onReceive;
  }

  async send(text, sessionId, options = {}) {
    const { language, channel } = options;
    const response = await sendMessage(text, sessionId, channel || "web", language);
    this.onReceive(response);
  }

  async getHistory(sessionId) {
    try {
      const res = await axios.get(`${API_URL}/api/chat/history/${sessionId}`);
      return res.data;
    } catch (err) {
      console.error("Failed to fetch history:", err);
      return { conversationHistory: [], cart: [] };
    }
  }
}
