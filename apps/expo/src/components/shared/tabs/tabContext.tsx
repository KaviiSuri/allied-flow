import React, { createContext, useContext, useState, ReactNode } from "react";

interface TabContextType {
  value: string;
  setValue: (value: string) => void;
}

const TabContext = createContext<TabContextType | undefined>(undefined);

interface TabProviderProps {
  children: ReactNode;
  defaultValue: string;
}

export const TabProvider: React.FC<TabProviderProps> = ({ children, defaultValue }) => {
  const [value, setValue] = useState(defaultValue);

  return (
    <TabContext.Provider value={{ value, setValue }}>
      {children}
    </TabContext.Provider>
  );
};

export const useTabContext = (): TabContextType => {
  const context = useContext(TabContext);
  if (!context) {
    throw new Error("useTabContext must be used within a TabProvider");
  }
  return context;
};
