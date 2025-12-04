import React, {useState} from "react";
import { apiLogin } from "../../services/authService";
import { useNavigate } from "react-router-dom";

export default function Login(){
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const nav = useNavigate();

  const enviar = async () => {
    const res = await apiLogin(email,password);
    const data = await res.json();
    if(res.ok){
      localStorage.setItem("token", data.token);
      localStorage.setItem("refresh", data.refresh);
      nav("/dashboard");
    } else {
      alert(data.message || "Error al iniciar sesión");
    }
  };

  return (
    <div className="container">
      <div className="card" style={{maxWidth:420, margin:"0 auto"}}>
        <h2>Iniciar Sesión</h2>
        <input type="email" placeholder="Correo" value={email} onChange={e=>setEmail(e.target.value)} />
        <input type="password" placeholder="Contraseña" value={password} onChange={e=>setPassword(e.target.value)} />
        <div className="row" style={{marginTop:12}}>
          <button onClick={enviar}>Ingresar</button>
        </div>
        <div className="small">
          <a href="/register">Crear cuenta</a> — <a href="/recover">Olvidé mi contraseña</a>
        </div>
      </div>
    </div>
  );
}
