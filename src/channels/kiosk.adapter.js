import { sendMessage } from "../api/chatService.js";

export class KioskAdapter {
  constructor(onReceive) {
    this.onReceive = onReceive;
  }

  async send(text, sessionId) {
    // simulate in-store kiosk
    const response = await sendMessage(text, sessionId, "kiosk");
    this.onReceive(response);
  }
}
