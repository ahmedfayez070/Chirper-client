import { createContext, useState, useEffect } from "react";
import makeRequest from "../axios";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );

  const login = async (inputs) => {
    const res = await makeRequest.post("/auth/login", inputs);
    setCurrentUser(res.data);
  };

  const register = async (inputs) => {
    const res = await makeRequest.post("/auth/register", inputs);
    setCurrentUser(res.data);
  };

  const logout = async () => {
    await makeRequest.post("/auth/logout");
    setCurrentUser(null);
  };

  useEffect(() => {
    if (currentUser !== undefined)
      localStorage.setItem("user", JSON.stringify(currentUser));
  }, [currentUser]);

  return (
    <AuthContext.Provider
      value={{ currentUser, register, login, logout, setCurrentUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};
