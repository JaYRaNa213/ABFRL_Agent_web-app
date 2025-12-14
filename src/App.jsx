import React from "react";
import { SessionProvider } from "./context/SessionContext.jsx";
import ChatWindow from "./components/ChatWindow.jsx";

export default function App() {
  return (
    <SessionProvider>
      <ChatWindow />
    </SessionProvider>
  );
}
