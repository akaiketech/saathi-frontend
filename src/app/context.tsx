"use client";

import React, { createContext, useContext, useState } from "react";

type GlobalContextProps = {
  language: string;
  setLanguage: React.Dispatch<React.SetStateAction<string>>;
  sessionId: string;
  setSessionId: React.Dispatch<React.SetStateAction<string>>;
};

const GlobalContext = createContext<GlobalContextProps | undefined>(undefined);

export const useGlobalContext = () => {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error("useGlobalContext must be used within a GlobalProvider");
  }
  return context;
};

interface GlobalProviderProps {
  children: React.ReactNode;
}

export const GlobalProvider: React.FC<GlobalProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState<string>("en");
  const [sessionId, setSessionId] = useState<string>("");

  return (
    <GlobalContext.Provider
      value={{
        language,
        setLanguage,
        sessionId,
        setSessionId,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};
