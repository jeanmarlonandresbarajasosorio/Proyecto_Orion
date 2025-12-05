import { useState } from "react";

function App() {
  const [usuario] = useState("Jean Marlon");
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [registros, setRegistros] = useState([]);

  const agregarRegistro = () => {
    if (!nombre.trim() || !email.trim()) return;

    setRegistros([
      ...registros,
      { id: Date.now(), nombre, email }
    ]);

    setNombre("");
    setEmail("");
  };

  const eliminarRegistro = (id) => {
    setRegistros(registros.filter(r => r.id !== id));
  };

  return (
    <div className="layout">

      {/* SIDEBAR IZQUIERDO */}
      <aside className="sidebar">
        <h2 className="sidebar-title">Panel</h2>

        <nav className="menu">
          <a className="menu-item" href="#">Dashboard</a>
          <a className="menu-item" href="#">Usuarios</a>
          <a className="menu-item" href="#">Reportes</a>
          <a className="menu-item" href="#">Configuración</a>
        </nav>
      </aside>

      {/* CONTENIDO PRINCIPAL */}
      <div className="main">

        {/* PANEL SUPERIOR */}
        <header className="header">
          <h1 className="logo">Proyecto Orion</h1>
          <div className="usuario-info">
            <span className="usuario-nombre">{usuario}</span>
          </div>
        </header>

        {/* CONTENIDO */}
        <div className="content">

          {/* FORMULARIO */}
          <div className="card">
            <h2>Registrar Usuario</h2>

            <div className="form-group">
              <label>Nombre</label>
              <input 
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Ingrese un nombre"
              />
            </div>

            <div className="form-group">
              <label>Correo</label>
              <input 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Ingrese un correo"
              />
            </div>

            <button className="btn" onClick={agregarRegistro}>Guardar</button>
          </div>

          {/* TABLA */}
          <div className="card">
            <h2>Usuarios registrados</h2>

            <div className="tabla-responsive">
              <table>
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Email</th>
                    <th>Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {registros.map(r => (
                    <tr key={r.id}>
                      <td>{r.nombre}</td>
                      <td>{r.email}</td>
                      <td>
                        <button 
                          className="btn-danger"
                          onClick={() => eliminarRegistro(r.id)}
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>

        </div>
      </div>

    </div>
  );
}

export default App;
