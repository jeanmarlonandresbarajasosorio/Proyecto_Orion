import React, { useState } from "react";

export default function CrudPanel() {
  const [form, setForm] = useState({ nombre: "", email: "", rol: "" });
  const [lista, setLista] = useState([]);
  const [editIndex, setEditIndex] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const enviar = (e) => {
    e.preventDefault();

    if (!form.nombre || !form.email || !form.rol) {
      alert("Completa todos los campos");
      return;
    }

    if (editIndex !== null) {
      const listaActualizada = [...lista];
      listaActualizada[editIndex] = form;
      setLista(listaActualizada);
      setEditIndex(null);
    } else {
      setLista([...lista, form]);
    }

    setForm({ nombre: "", email: "", rol: "" });
  };

  const editar = (index) => {
    setForm(lista[index]);
    setEditIndex(index);
  };

  const eliminar = (index) => {
    if (confirm("¿Seguro que deseas eliminar este registro?")) {
      setLista(lista.filter((_, i) => i !== index));
    }
  };

  return (
    <div className="crud-container">
      <h2>Gestión de Equipos</h2>

      {/* FORMULARIO */}
      <form className="crud-form" onSubmit={enviar}>
        <input
          type="text"
          name="SERIAL"
          placeholder="SERIAL"
          value={form.nombre}
          onChange={handleChange}
        />

        <input
          type="email"
          name="email"
          placeholder="COLOR"
          value={form.email}
          onChange={handleChange}
        />

        <input
          type="text"
          name="rol"
          placeholder="AREA"
          value={form.rol}
          onChange={handleChange}
        />

        <button type="submit" className="crud-btn">
          {editIndex !== null ? "Actualizar" : "Agregar"}
        </button>
      </form>

      {/* TABLA */}
      <table className="crud-table">
      

        <tbody>
          {lista.length === 0 ? (
            <tr>
              <td colSpan="4" style={{ textAlign: "center", padding: "15px" }}>
                No hay registros aún
              </td>
            </tr>
          ) : (
            lista.map((item, i) => (
              <tr key={i}>
                <td>{item.nombre}</td>
                <td>{item.email}</td>
                <td>{item.rol}</td>
                <td>
                  <button className="edit-btn" onClick={() => editar(i)}>
                    Editar
                  </button>

                  <button className="delete-btn" onClick={() => eliminar(i)}>
                    Eliminar
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
