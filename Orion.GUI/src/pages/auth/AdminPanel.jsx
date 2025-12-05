import React, { useState } from "react";

export default function AdminPanel() {
  const [items, setItems] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [form, setForm] = useState({ title: "", description: "", image: "" });

  const modules = [
    "Datos del Área",
    "Datos del Equipo",
    "Datos de Autorización de Retiro",
    "Recibo del Equipo en Mantenimiento",
    "Lista de Chequeo de Software",
    "Garantía",
    "Lista de Chequeo de Hardware",
    "Tiempo de Parada",
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title || !form.description || !form.image) return;

    if (editingIndex !== null) {
      const updated = [...items];
      updated[editingIndex] = form;
      setItems(updated);
      setEditingIndex(null);
    } else {
      setItems([...items, form]);
    }

    setForm({ title: "", description: "", image: "" });
  };

  const handleEdit = (index) => {
    setForm(items[index]);
    setEditingIndex(index);
  };

  const handleDelete = (index) => {
    const updated = items.filter((_, i) => i !== index);
    setItems(updated);
  };

  // Clase para el botón principal (Guardar/Actualizar)
  const primaryButtonClass =
    "w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg transition duration-200 shadow-md hover:shadow-lg";

  // Clase para inputs y textareas
  const inputClass =
    "w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150";

  return (
    <div className="flex bg-gray-50 text-gray-800 min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-2xl p-6 fixed h-full z-10 border-r border-gray-200">
        <h2 className="text-2xl font-extrabold text-blue-700 text-center mb-10 border-b pb-4">
          Panel ⚙️
        </h2>
        <nav className="flex flex-col space-y-2">
          {modules.map((m, i) => (
            <a
              key={i}
              href="#"
              // Aplica una clase 'active' para simular el módulo seleccionado (el primero como ejemplo)
              className={`p-3 rounded-xl transition duration-200 flex items-center gap-3 ${
                i === 0
                  ? "bg-blue-600 text-white shadow-lg font-bold"
                  : "text-gray-600 hover:bg-blue-50 hover:text-blue-600 font-medium"
              }`}
            >
              {/* Aquí podrías agregar íconos si usas alguna librería como FontAwesome o Lucide */}
              {m}
            </a>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="ml-64 flex-grow p-10">
        {/* Header */}
        <header className="flex justify-between items-center mb-10 bg-white p-6 rounded-2xl shadow-lg">
          <h1 className="text-4xl font-extrabold text-gray-900">
            Bienvenido al Panel de Administración 👋
          </h1>
          <button className="bg-red-500 hover:bg-red-600 text-white font-medium px-5 py-2 rounded-xl transition duration-200 shadow-md">
            Cerrar sesión
          </button>
        </header>

        {/* Form Section */}
        <section className="bg-white p-8 rounded-2xl shadow-xl mb-10 border border-gray-100">
          <h2 className="text-2xl font-bold text-blue-700 mb-6 border-b pb-3">
            {editingIndex !== null ? "Editar Registro" : "Agregar Nuevo Registro"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            <input
              className={inputClass}
              placeholder="Título"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />

            <textarea
              className={`${inputClass} h-32 resize-none`}
              placeholder="Descripción"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />

            <input
              className={inputClass}
              placeholder="URL de Imagen (ej: https://ruta/a/imagen.jpg)"
              value={form.image}
              onChange={(e) => setForm({ ...form, image: e.target.value })}
            />

            <button type="submit" className={primaryButtonClass}>
              {editingIndex !== null ? "Actualizar Registro" : "Guardar Registro"}
            </button>
          </form>
        </section>

        {/* Table Section */}
        <section className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
          <h2 className="text-2xl font-bold text-blue-700 mb-6 border-b pb-3">
            Lista de Registros 📋 ({items.length})
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-blue-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider border-b-2 border-blue-200">
                    Título
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider border-b-2 border-blue-200">
                    Descripción
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider border-b-2 border-blue-200">
                    Imagen
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider border-b-2 border-blue-200">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {items.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="px-6 py-4 text-center text-gray-500 italic">
                      No hay registros aún. ¡Usa el formulario para agregar uno!
                    </td>
                  </tr>
                ) : (
                  items.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50 transition duration-150">
                      <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                        {item.title}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                        {item.description}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-16 h-16 object-cover rounded-md shadow-md"
                            onError={(e) => { e.target.onerror = null; e.target.src = "https://via.placeholder.com/64x64?text=No+Img" }} // fallback
                          />
                        ) : (
                          <span className="text-gray-400">Sin imagen</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-3">
                          <button
                            className="text-green-600 hover:text-green-900 font-semibold transition duration-150 p-2 rounded-lg hover:bg-green-100"
                            onClick={() => handleEdit(index)}
                          >
                            Editar
                          </button>
                          <button
                            className="text-red-600 hover:text-red-900 font-semibold transition duration-150 p-2 rounded-lg hover:bg-red-100"
                            onClick={() => handleDelete(index)}
                          >
                            Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}