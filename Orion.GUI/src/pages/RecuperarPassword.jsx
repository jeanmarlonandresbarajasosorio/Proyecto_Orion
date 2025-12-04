import { useState } from "react";

export default function RecuperarPassword() {

  const [email, setEmail] = useState("");
  const [codigo, setCodigo] = useState("");
  const [nueva, setNueva] = useState("");

  const solicitarCodigo = async () => {
    await fetch("/api/auth/reset", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({ email })
    });
    alert("Código enviado");
  };

  const cambiar = async () => {
    const r = await fetch("/api/auth/change-password", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({ email, codigo, nuevaPassword: nueva })
    });
    const data = await r.json();
    alert(data.message);
  };

  return (
    <>
      <h2>Recuperar Contraseña</h2>

      <input placeholder="Correo" onChange={e => setEmail(e.target.value)} />
      <button onClick={solicitarCodigo}>Enviar Código</button>

      <input placeholder="Código" onChange={e => setCodigo(e.target.value)} />
      <input type="password" placeholder="Nueva contraseña" onChange={e => setNueva(e.target.value)} />
      <button onClick={cambiar}>Cambiar Contraseña</button>
    </>
  );
}
