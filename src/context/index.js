import { useState, createContext } from "react";

export const PreferencesContext = createContext();

export const PreferencesProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(false);
  return (
    <PreferencesContext.Provider value={{ darkMode, setDarkMode }}>
      {children}
    </PreferencesContext.Provider>
  );
};
