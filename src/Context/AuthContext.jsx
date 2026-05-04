// src/Context/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from 'react';
import { getCurrentUser, signOut } from 'aws-amplify/auth';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [isLogged, setIsLogged] = useState(false);
  const [isAuthReady, setIsAuthReady] = useState(false);

  const login = () => setIsLogged(true);

  const logout = async () => {
    await signOut();
    setIsLogged(false);
  };

  useEffect(() => {
    const checkCurrentUser = async () => {
      try {
        await getCurrentUser();
        setIsLogged(true);
      } catch {
        setIsLogged(false);
      } finally {
        setIsAuthReady(true);
      }
    };

    checkCurrentUser();
  }, []);

  return (
    <AuthContext.Provider value={{ isLogged, isAuthReady, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
