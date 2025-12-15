import { createContext, useState, useContext } from "react";

const SessionContext = createContext();

export function SessionProvider({ children }) {
  const [sessionId, setSessionId] = useState(() => {
    const stored = localStorage.getItem("abfrl_session");
    if (stored) return stored;
    const newId = crypto.randomUUID();
    localStorage.setItem("abfrl_session", newId);
    return newId;
  });
  const [channel, setChannel] = useState("web");

  /* Messaging trigger for Shop -> Agent communication */
  const [pendingMessage, setPendingMessage] = useState(null);

  const triggerAgentMessage = (msg) => {
    setPendingMessage(msg);
  };

  return (
    <SessionContext.Provider value={{ sessionId, setSessionId, channel, setChannel, pendingMessage, triggerAgentMessage }}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  return useContext(SessionContext);
}
