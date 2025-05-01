
import React, { createContext, useState, useContext } from "react";


interface NameContextType {
  name: string;
  setName: React.Dispatch<React.SetStateAction<string>>;
}

// Create the Context
const NameContext = createContext<NameContextType | undefined>(undefined);

// Context Provider Component
export const NameProvider = ({ children }: { children: React.ReactNode }) => {
  const [name, setName] = useState<string>("");

  return (
    <NameContext.Provider value={{ name, setName }}>
      {children}
    </NameContext.Provider>
  );
};

// Custom Hook for easier access
export const useName = () => {
  const context = useContext(NameContext);
  if (!context) {
    throw new Error("useName must be used within a NameProvider");
  }
  return context;
};




