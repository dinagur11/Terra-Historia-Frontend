import { createContext, useContext, useState, useEffect } from 'react';
import { getCurrentUser, signOut } from 'aws-amplify/auth';

/* eslint-disable react-refresh/only-export-components */
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [isLogged, setIsLogged] = useState(false);
  const [isAuthReady, setIsAuthReady] = useState(false);

  useEffect(() => {
    const syncAuth = async () => {
      try {
        await getCurrentUser();
        setIsLogged(true);
      } catch {
        setIsLogged(false);
      } finally {
        setIsAuthReady(true);
      }
    };

    syncAuth();
  }, []);

  const login = () => setIsLogged(true);

  const logout = async () => {
    await signOut();
    setIsLogged(false);
  };

  return (
    <AuthContext.Provider value={{ isLogged, isAuthReady, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
