// frontend/src/contexts/AuthContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  useEffect(() => {
    // Carrega token/user do localStorage ao montar
    const storedToken = localStorage.getItem("vs_token");
    const storedUser = localStorage.getItem("vs_user");
    if (storedToken) {
      setToken(storedToken);
      axios.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;
    }
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const login = async (email, password) => {
    try {
      const res = await axios.post(`${API}/api/auth/login`, { email, password });
      const { token: jwt, user: userData } = res.data;
      // salvar
      setToken(jwt);
      setUser(userData);
      localStorage.setItem("vs_token", jwt);
      localStorage.setItem("vs_user", JSON.stringify(userData));
      axios.defaults.headers.common["Authorization"] = `Bearer ${jwt}`;
      return { ok: true };
    } catch (err) {
      console.error("Erro login:", err?.response?.data || err.message);
      return { ok: false, error: err?.response?.data?.message || "Erro no login" };
    }
  };

  const register = async (email, password, name) => {
    try {
      const res = await axios.post(`${API}/api/auth/register`, { email, password, name });
      // dependendo do backend, pode retornar user ou mensagem. Se retornar token, trate aqui.
      return { ok: true, data: res.data };
    } catch (err) {
      console.error("Erro register:", err?.response?.data || err.message);
      return { ok: false, error: err?.response?.data?.message || "Erro no cadastro" };
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("vs_token");
    localStorage.removeItem("vs_user");
    delete axios.defaults.headers.common["Authorization"];
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
