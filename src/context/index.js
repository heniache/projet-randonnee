import { useState, useEffect, createContext } from "react";

export const PreferencesContext = createContext();

export const PreferencesProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(false);
  return (
    <PreferencesContext.Provider value={{ darkMode, setDarkMode }}>
      {children}
    </PreferencesContext.Provider>
  );
};

export const LoadingContext = createContext();

export const LoadingProvider = ({ children }) => {
  const [loadingCount, setLoadingCount] = useState(0);

  useEffect(() => {
    const origFetch = window.fetch;
    window.fetch = (...args) => {
      setLoadingCount((c) => c + 1);
      return origFetch(...args).finally(() => setLoadingCount((c) => c - 1));
    };
    return () => {
      window.fetch = origFetch;
    };
  }, []);

  return (
    <LoadingContext.Provider value={{ isLoading: loadingCount > 0 }}>
      {children}
    </LoadingContext.Provider>
  );
};
