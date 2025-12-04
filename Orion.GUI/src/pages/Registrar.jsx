import { useState } from "react";

export default function Registrar() {

  const [form, setForm] = useState({
    nombre: "", email: "", password: ""
  });

  const registrar = async () => {
    const r = await fetch("/api/auth/register", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(form)
    });

    const data = await r.json();
    alert(data.message);
  };

  return (
    <>
      <h2>Crear Cuenta</h2>
      <input placeholder="Nombre" onChange={e => setForm({...form, nombre: e.target.value})} />
      <input placeholder="Correo" onChange={e => setForm({...form, email: e.target.value})} />
      <input type="password" placeholder="Contraseña" onChange={e => setForm({...form, password: e.target.value})} />
      <button onClick={registrar}>Registrar</button>
    </>
  );
}
