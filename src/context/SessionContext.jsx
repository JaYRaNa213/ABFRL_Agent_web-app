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

  return (
    <SessionContext.Provider value={{ sessionId, setSessionId, channel, setChannel }}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  return useContext(SessionContext);
}
