import { createContext, useContext, useState } from "react";

const DebugContext = createContext();

export const DebugProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);

  const addMessage = (message) => {
    setMessages((prev) => [message, ...prev]);
  };

  const clearMessages = () => {
    setMessages([]);
  };

  return (
    <DebugContext.Provider value={{ messages, addMessage, clearMessages }}>
      {children}
    </DebugContext.Provider>
  );
};

export const useDebug = () => {
  const context = useContext(DebugContext);
  if (!context) {
    throw new Error("useDebug must be used within a DebugProvider");
  }
  return context;
};