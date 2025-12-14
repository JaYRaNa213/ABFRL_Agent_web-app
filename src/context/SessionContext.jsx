import { createContext, useState, useContext } from "react";

const SessionContext = createContext();

export function SessionProvider({ children }) {
  const [sessionId, setSessionId] = useState(null);
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
