import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import * as authService from "../services/authService.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState("");

  useEffect(() => {
    let active = true;
    authService.getCurrentUser()
      .then((currentUser) => { if (active) setUser(currentUser); })
      .catch((error) => { if (active) setAuthError(error.message); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  const signIn = useCallback(async (email, password) => {
    setAuthError("");
    try {
      const nextUser = await authService.login(email, password);
      setUser(nextUser);
      return nextUser;
    } catch (error) {
      setAuthError(error.message);
      throw error;
    }
  }, []);

  const signOut = useCallback(async () => {
    setAuthError("");
    try {
      await authService.logout();
      setUser(null);
    } catch (error) {
      setAuthError(error.message);
      throw error;
    }
  }, []);

  const value = useMemo(() => ({
    user,
    loading,
    isAuthenticated: Boolean(user),
    authError,
    login: signIn,
    logout: signOut,
    clearAuthError: () => setAuthError(""),
  }), [user, loading, authError, signIn, signOut]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// oxlint-disable-next-line react/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
}
