import { useEffect, useState } from "react";
import "./login.css";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  /* ===================== */
  /* 🔐 LOGIN NORMAL       */
  /* ===================== */
  const submit = (e) => {
    e.preventDefault();
    if (!email || !password) return;

    onLogin({
      name: "Jean Marlon",
      email,
      provider: "local",
    });
  };

  /* ===================== */
  /* 🔑 GOOGLE LOGIN       */
  /* ===================== */
  useEffect(() => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

    if (!clientId) {
      console.error("❌ GOOGLE CLIENT ID no definido en .env");
      return;
    }

    const initGoogle = () => {
      if (!window.google || !window.google.accounts?.id) return;

      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: handleGoogleLogin,
        auto_select: false,               
        cancel_on_tap_outside: true,      
      });

      window.google.accounts.id.prompt();

      // 🎯 Render botón
      window.google.accounts.id.renderButton(
        document.getElementById("google-login"),
        {
          theme: "outline",
          size: "large",
          width: 300,
        }
      );
    };

    const interval = setInterval(() => {
      if (window.google?.accounts?.id) {
        initGoogle();
        clearInterval(interval);
      }
    }, 300);

    return () => clearInterval(interval);
  }, []);

  /* ===================== */
  /* 🔐 RESPUESTA GOOGLE   */
  /* ===================== */
  const handleGoogleLogin = (response) => {
    if (!response?.credential) return;

    const user = JSON.parse(
      atob(response.credential.split(".")[1])
    );

    onLogin({
      name: user.name,
      email: user.email,
      picture: user.picture,
      provider: "google",
    });
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="login-title">Bienvenido a ORION</h1>
        <p className="login-subtitle">Gestión de Mantenimiento</p>

        {/* 🔐 LOGIN NORMAL */}
        <form onSubmit={submit} className="login-form">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            placeholder="usuario@orion.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label htmlFor="password">Contraseña</label>
          <input
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit" className="login-button">
            Iniciar sesión
          </button>
        </form>

        {/* 🔽 GOOGLE BUTTON */}
        <div style={{ marginTop: "1.5rem", textAlign: "center" }}>
          <div id="google-login"></div>
        </div>
      </div>
    </div>
  );
}
