import React, { createContext, useContext, useState, useEffect } from 'react';
import { getPatientProfile } from '../modules/patient/api/profilePatientAPi';
import { getDoctorProfile } from '../modules/doctor/api/profileDoctorApi';
import { TokenService } from '../services/tokenService';

const AuthContext = createContext(null);

// Decode a JWT payload without any external library
function decodeToken(token) {
  try {
    const payload = token.split(".")[1];
    return JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/")));
  } catch {
    return {};
  }
}

// Extract role from JWT claims (handles Microsoft-style long claim URIs)
function getRoleFromClaims(claims) {
  const roleEntry = Object.entries(claims).find(([k]) =>
    k.toLowerCase().includes("role")
  );
  const role = roleEntry?.[1];
  if (Array.isArray(role)) return role[0];
  return role || null;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const hasToken = TokenService.hasToken() || localStorage.getItem("userToken");
      if (!hasToken) {
        setUser(null);
        setRole(null);
        return;
      }

      // Decode the JWT to determine the role
      const rawToken = TokenService.getToken() || localStorage.getItem("userToken");
      const claims = decodeToken(rawToken);
      const userRole = getRoleFromClaims(claims);
      setRole(userRole);

      let profileData = null;
      const roleLower = userRole?.toLowerCase();
      if (roleLower === "doctor") {
        profileData = await getDoctorProfile();
      } else if (roleLower === "patient") {
        profileData = await getPatientProfile();
      }

      if (profileData) {
        // Normalize keys for Navbar (supports both camelCase and PascalCase from API)
        const normalizedUser = {
          ...profileData,
          firstName: profileData.firstName || profileData.FirstName || "",
          lastName: profileData.lastName || profileData.LastName || "",
          email: profileData.email || profileData.Email || claims.email || "",
          role: userRole
        };
        setUser(normalizedUser);
      } else {
        // Fallback for roles without profile endpoints or if fetch failed
        setUser({ email: claims.email || "", role: userRole });
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
    setRole(null);
  };

  return (
    <AuthContext.Provider value={{ user, role, loading, login, logout, fetchUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
