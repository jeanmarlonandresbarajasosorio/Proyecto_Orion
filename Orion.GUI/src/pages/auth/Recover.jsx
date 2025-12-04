import React, {useState} from "react";
import { apiRequestReset, apiChangePassword } from "../../services/authService";

export default function Recover(){
  const [email,setEmail] = useState("");
  const [code,setCode] = useState("");
  const [newPass,setNewPass] = useState("");

  const pedir = async () => {
    const r = await apiRequestReset(email);
    if(r.ok) alert("Código enviado (en entorno real por email). Revisa consola servidor.");
    else alert("Error o usuario no existe");
  };

  const cambiar = async () => {
    const r = await apiChangePassword({ email, codigo: code, nuevaPassword: newPass });
    const data = await r.json();
    alert(data.message || "Operación completada");
  };

  return (
    <div className="container">
      <div className="card" style={{maxWidth:520, margin:"0 auto"}}>
        <h2>Recuperar contraseña</h2>

        <input placeholder="Tu correo" onChange={e=>setEmail(e.target.value)} />
        <button style={{marginTop:8}} onClick={pedir}>Enviar código</button>

        <hr style={{opacity:0.06}}/>

        <input placeholder="Código" onChange={e=>setCode(e.target.value)} />
        <input type="password" placeholder="Nueva contraseña" onChange={e=>setNewPass(e.target.value)} />
        <button onClick={cambiar}>Cambiar contraseña</button>
      </div>
    </div>
  );
}
