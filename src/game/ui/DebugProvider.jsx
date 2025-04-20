import React, { createContext, useState, useContext } from 'react';

// Создаем контекст для дебаг-информации
const DebugContext = createContext();

// Провайдер для дебаг-информации
export const DebugProvider = ({ children }) => {
  const [debugInfo, setDebugInfo] = useState([]);

  // Функция для добавления новой записи
  const addDebugInfo = (data, label = 'Debug Info') => {
    setDebugInfo((prev) => [
      ...prev,
      { id: Date.now(), label, data, timestamp: new Date().toISOString() },
    ]);
  };

  return (
    <DebugContext.Provider value={{ debugInfo, addDebugInfo }}>
      {children}
    </DebugContext.Provider>
  );
};

// Хук для использования контекста
export const useDebug = () => {
  const context = useContext(DebugContext);
  if (!context) {
    throw new Error('useDebug must be used within a DebugProvider');
  }
  return context;
};