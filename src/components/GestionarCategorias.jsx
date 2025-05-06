import { useState } from 'react';

const GestionarCategorias = ({ loadCategorias, setSuccess, setError, userId, categorias = [] }) => {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');

  const handleCrearCategoria = async (e) => {
    e.preventDefault();
    if (!userId || isNaN(parseInt(userId))) {
      setError('ID de administrador no válido');
      return;
    }
    try {
      const response = await fetch('/MicroServicioCategorias/api/categorias/crear', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, descripcion, id_administrador: parseInt(userId) })
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      if (result.success) {
        setSuccess(result.message);
        loadCategorias();
        setNombre('');
        setDescripcion('');
      } else {
        setError(result.message || 'Error al crear categoría');
      }
    } catch (err) {
      setError(`Error al crear categoría: ${err.message}`);
    }
  };

  return (
    <div className="mt-4">
      <h3 className="h4 mb-3">Gestionar Categorías</h3>
      <form onSubmit={handleCrearCategoria} className="mb-3">
        <div className="mb-3">
          <label className="form-label">Nombre</label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="form-control"
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Descripción</label>
          <textarea
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            className="form-control"
            required
          />
        </div>
        <button type="submit" className="btn btn-success w-100">
          Crear Categoría
        </button>
      </form>
      <h4 className="h5">Categorías Existentes</h4>
      <ul className="list-group mt-2">
        {categorias.map((cat) => (
          <li key={cat.id} className="list-group-item">
            {cat.nombre} - {cat.descripcion}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GestionarCategorias;