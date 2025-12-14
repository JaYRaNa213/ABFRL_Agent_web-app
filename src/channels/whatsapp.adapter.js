import { sendMessage } from "../api/chatService.js";

export class WhatsAppAdapter {
  constructor(onReceive) {
    this.onReceive = onReceive;
  }

  async send(text, sessionId) {
    // simulate WhatsApp channel
    const response = await sendMessage(text, sessionId, "whatsapp");
    this.onReceive(response);
  }
}
