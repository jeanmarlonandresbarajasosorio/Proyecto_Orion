import { useState, useEffect } from "react";
import { apiRefresh } from "../services/authService";

export function useAuth(){
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [refresh, setRefresh] = useState(localStorage.getItem("refresh"));

  useEffect(() => {
    // Guardar cambios
    if(token) localStorage.setItem("token", token);
    else localStorage.removeItem("token");
  }, [token]);

  useEffect(()=>{
    if(refresh) localStorage.setItem("refresh", refresh);
    else localStorage.removeItem("refresh");
  },[refresh]);

  // función para intentar refrescar token
  const tryRefresh = async () => {
    if(!refresh) { setToken(null); return null; }
    const res = await apiRefresh(refresh);
    if(res.ok){
      const data = await res.json();
      setToken(data.token);
      return data.token;
    } else {
      setToken(null);
      setRefresh(null);
      return null;
    }
  };

  const logout = () => {
    setToken(null);
    setRefresh(null);
    localStorage.removeItem("token");
    localStorage.removeItem("refresh");
    window.location.href = "/login";
  };

  return { token, setToken, refresh, setRefresh, tryRefresh, logout };
}
