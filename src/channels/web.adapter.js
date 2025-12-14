import { sendMessage } from "../api/chatService.js";

export class WebAdapter {
  constructor(onReceive) {
    this.onReceive = onReceive; // callback for agent reply
  }

  async send(text, sessionId) {
    const response = await sendMessage(text, sessionId, "web");
    this.onReceive(response);
  }
}
