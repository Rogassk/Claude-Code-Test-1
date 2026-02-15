import { createContext, useState, useEffect, useCallback } from 'react';
import { authApi } from '../api/auth';
import { setAccessToken } from '../api/client';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // On mount, try to restore session from stored refresh token
  useEffect(() => {
    const refreshToken = localStorage.getItem('refreshToken');
    if (refreshToken) {
      authApi
        .refresh(refreshToken)
        .then((data) => {
          setUser(data.user);
          setAccessToken(data.accessToken);
          localStorage.setItem('refreshToken', data.refreshToken);
        })
        .catch(() => {
          localStorage.removeItem('refreshToken');
        })
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = useCallback(async (email, password) => {
    const data = await authApi.login({ email, password });
    setUser(data.user);
    setAccessToken(data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    return data;
  }, []);

  const signup = useCallback(async (name, email, password) => {
    const data = await authApi.signup({ name, email, password });
    setUser(data.user);
    setAccessToken(data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    return data;
  }, []);

  const logout = useCallback(async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    try {
      await authApi.logout(refreshToken);
    } catch {}
    setUser(null);
    setAccessToken(null);
    localStorage.removeItem('refreshToken');
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated: !!user, isLoading, login, signup, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}
