import axios from "axios";

const API_BASE = "http://localhost:5000/api/chat";

export async function sendMessage(message, sessionId, channel, language) {
  const response = await axios.post(API_BASE, {
    message,
    sessionId,
    channel,
    language
  });
  return response.data;
}
