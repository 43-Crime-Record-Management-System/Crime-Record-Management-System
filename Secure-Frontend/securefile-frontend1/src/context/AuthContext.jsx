/* eslint-disable react-refresh/only-export-components */

import { createContext, useContext, useState, useEffect } from "react";
import { AUTH_API_URL } from "../config";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        return JSON.parse(storedUser);
      }

      const token = localStorage.getItem("token");
      if (token) {
        return {
          token: token,
          role: localStorage.getItem("role"),
          email: localStorage.getItem("email"),
          fullName: localStorage.getItem("fullName") || "User",
          station: localStorage.getItem("station"),
          userId: localStorage.getItem("userId")
        };
      }
      return null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token") || user?.token;
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`${AUTH_API_URL}/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.ok) {
          const data = await res.json();
          setUser(prev => {
            const updatedUser = {
              ...prev,
              ...data,
              token: token // ensure token persists
            };
            localStorage.setItem("user", JSON.stringify(updatedUser));
            // Sync specific keys for legacy/other components
            if (data.fullName) localStorage.setItem("fullName", data.fullName);
            if (data.station) localStorage.setItem("station", data.station);
            if (data.userId) localStorage.setItem("userId", data.userId);
            return updatedUser;
          });
        }
      } catch (err) {
        console.error("AuthContext profile fetch failed:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
    if (userData.token) localStorage.setItem("token", userData.token);
    if (userData.role) localStorage.setItem("role", userData.role);
    if (userData.email) localStorage.setItem("email", userData.email);
    if (userData.fullName) localStorage.setItem("fullName", userData.fullName);
    if (userData.station) localStorage.setItem("station", userData.station);
    if (userData.userId) localStorage.setItem("userId", userData.userId);
  };

  const updateUser = (data) => {
    setUser(prev => {
      const newUser = { ...prev, ...data };
      localStorage.setItem("user", JSON.stringify(newUser));
      if (data.fullName) localStorage.setItem("fullName", data.fullName);
      if (data.station) localStorage.setItem("station", data.station);
      if (data.userId) localStorage.setItem("userId", data.userId);
      return newUser;
    });
  };

  const logout = () => {
    setUser(null);
    localStorage.clear();
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
