import { createContext, useContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  /* ========================= */
  /* INIT FROM TOKEN */
  /* ========================= */
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const decoded = jwtDecode(token);

        const normalizedUser = {
          _id: decoded.id || decoded._id,
          name: decoded.name,
          email: decoded.email,
          role: decoded.role || null,
          permissions: decoded.permissions || []
        };

        setUser(normalizedUser);
        localStorage.setItem("user", JSON.stringify(normalizedUser));
      } catch (error) {
        console.error("❌ Token inválido", error);
        localStorage.clear();
        setUser(null);
      }
    }

    setLoading(false);
  }, []);

  /* ========================= */
  /* LOGIN */
  /* ========================= */
  const login = (data) => {
    /*
      data esperado del backend:
      {
        token,
        user: {
          _id,
          name,
          email,
          role,
          permissions:[]
        }
      }
    */

    localStorage.setItem("token", data.token);

    const normalizedUser = {
      _id: data.user._id,
      name: data.user.name,
      email: data.user.email,
      role: data.user.role || null,
      permissions: data.user.permissions || []
    };

    localStorage.setItem("user", JSON.stringify(normalizedUser));
    setUser(normalizedUser);
  };

  /* ========================= */
  /* LOGOUT */
  /* ========================= */
  const logout = () => {
    localStorage.clear();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        login,
        logout,
        loading
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
