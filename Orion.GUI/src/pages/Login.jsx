import { useState } from "react";
import "./login.css";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submit = (e) => {
    e.preventDefault();

    // 🔐 LOGIN SIMULADO
    if (!email || !password) return;

    onLogin({
      name: "Jean Marlon",
    });
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="login-title">Bienvenido ORION</h1>
        <p className="login-subtitle">Gestión de Mantenimientos</p>

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
      </div>
    </div>
  );
}
