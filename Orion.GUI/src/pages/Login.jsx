import { useEffect } from "react";
import "./login.css";
import { googleLogin } from "../services/authService";

export default function Login({ onLogin }) {

  const handleGoogleLogin = async (response) => {
    if (!response?.credential) return;

    const googleUser = JSON.parse(
      atob(response.credential.split(".")[1])
    );

    try {
      const res = await googleLogin({
        name: googleUser.name,
        email: googleUser.email,
        picture: googleUser.picture,
      });

      if (!res.data?.token) {
        throw new Error("Token no recibido");
      }

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      onLogin(res.data.user);

    } catch (error) {
      console.error("❌ Acceso denegado", error);
      alert("❌ No autorizado");
    }
  };

  useEffect(() => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (!clientId) return;

    const initGoogle = () => {
      if (!window.google?.accounts?.id) return;

      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: handleGoogleLogin,
        ux_mode: "popup",
      });

      window.google.accounts.id.renderButton(
        document.getElementById("google-login"),
        { 
          theme: "filled_blue", // Cambiado a 'filled_blue' para quitar el borde gris del botón
          size: "large", 
          width: 260,
          shape: "pill" // Forma redondeada para que combine con el logo circular
        }
      );
    };

    const i = setInterval(() => {
      if (window.google?.accounts?.id) {
        initGoogle();
        clearInterval(i);
      }
    }, 300);

    return () => clearInterval(i);
  }, []);

  return (
    <div className="login-container">
      <div className="login-card">

        <div className="login-logo-wrapper">
          <img
            src="/LogoOrion.png"
            alt="Logo FOSCAL"
            className="login-logo"
          />
        </div>

        <div className="login-header">
          <h1 className="login-title">
          </h1>
          <p className="login-subtitle">
            Gestión de Mantenimiento FOSCAL
          </p>
          
        </div>

        <div className="login-divider" />

        <div className="login-google">
          <div id="google-login"></div>
        </div>

        <p className="login-footer">
          Acceso Exclusivo Para Personal Autorizado
        </p>

      </div>
    </div>
  );
}