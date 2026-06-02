import { useState, useEffect, createContext, useContext } from "react";

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

// ─── Auth ───────────────────────────────────────────────────────────────────

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => ({
    isAuthenticated: Boolean(
      localStorage.getItem("token") && localStorage.getItem("userId")
    ),
    role: localStorage.getItem("role") || null,
  }));

  const login = (token, userId, role) => {
    localStorage.setItem("token", token);
    localStorage.setItem("userId", userId);
    localStorage.setItem("role", role);
    setUser({ isAuthenticated: true, role });
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("role");
    setUser({ isAuthenticated: false, role: null });
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
