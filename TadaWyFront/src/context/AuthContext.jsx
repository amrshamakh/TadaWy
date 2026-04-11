import React, { createContext, useContext, useState, useEffect } from 'react';
import { getPatientProfile } from '../modules/patient/api/profilePatientAPi';
import { TokenService } from '../services/tokenService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const token = TokenService.hasToken() || localStorage.getItem("userToken");
      if (token) {
        // Fetch fresh profile from API
        const profileData = await getPatientProfile();
        setUser(profileData);
      } else {
        setUser(null);
      }
    } catch (err) {
      console.error("Failed to fetch user profile", err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const login = async (token, refreshToken) => {
    TokenService.setToken(token, refreshToken);
    localStorage.setItem("userToken", token);
    if (refreshToken) {
      localStorage.setItem("refreshToken", refreshToken);
    }
    await fetchUser();
  };

  const logout = () => {
    TokenService.removeToken();
    localStorage.removeItem("userToken");
    localStorage.removeItem("refreshToken");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, fetchUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
