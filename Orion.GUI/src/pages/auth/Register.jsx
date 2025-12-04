import React, {useState} from "react";
import { apiRegister } from "../../services/authService";
import { useNavigate } from "react-router-dom";

export default function Register(){
  const [form,setForm] = useState({ nombre:"", email:"", password:"" });
  const nav = useNavigate();

  const enviar = async () => {
    const res = await apiRegister(form);
    const data = await res.json();
    if(res.ok) {
      alert(data.message || "Registrado");
      nav("/login");
    } else {
      alert(data.message || "Error registrando");
    }
  };

  return (
    <div className="container">
      <div className="card" style={{maxWidth:420, margin:"0 auto"}}>
        <h2>Crear cuenta</h2>
        <input placeholder="Nombre" onChange={e=>setForm({...form, nombre:e.target.value})} />
        <input placeholder="Correo" onChange={e=>setForm({...form, email:e.target.value})} />
        <input type="password" placeholder="Contraseña" onChange={e=>setForm({...form, password:e.target.value})} />
        <div style={{marginTop:12}}>
          <button onClick={enviar}>Registrar</button>
        </div>
        <div className="small"><a href="/login">Volver a login</a></div>
      </div>
    </div>
  );
}
