import { useState } from "react";

export default function Login() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const enviar = async () => {
    const r = await fetch("/api/auth/login", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({ email, password })
    });
    const data = await r.json();

    if (r.ok) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("refresh", data.refresh);
      window.location.href = "/dashboard";
    } else {
      alert(data.message);
    }
  };

  return (
    <>
      <h2>Iniciar Sesión</h2>
      <input type="email" placeholder="Correo" onChange={e => setEmail(e.target.value)} />
      <input type="password" placeholder="Contraseña" onChange={e => setPassword(e.target.value)} />
      <button onClick={enviar}>Ingresar</button>
    </>
  );
}
