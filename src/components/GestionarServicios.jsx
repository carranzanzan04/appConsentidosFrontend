import { useState } from 'react';

const GestionarServicios = ({ categorias, loadServicios, setSuccess, setError, servicios = [], userId }) => {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [idCategoria, setIdCategoria] = useState('');

  const handleCrearServicio = async (e) => {
    e.preventDefault();
    if (!userId || isNaN(parseInt(userId))) {
      setError('ID de prestador no válido');
      return;
    }
    if (!idCategoria) {
      setError('Seleccione una categoría');
      return;
    }
    try {
      const response = await fetch('/MicroservicioServicios/api/servicios/register/servicio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre,
          descripcion,
          idPrestador: parseInt(userId),
          idCategoria: parseInt(idCategoria)
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error HTTP: ${response.status} - ${errorText || 'No se recibió mensaje de error'}`);
      }

      const text = await response.text();
      if (!text) {
        throw new Error('La respuesta del servidor está vacía');
      }

      let result;
      try {
        result = JSON.parse(text);
      } catch (parseError) {
        throw new Error('Respuesta no es JSON válido: ' + parseError.message);
      }

      if (result.success) {
        setSuccess(result.message);
        loadServicios();
        setNombre('');
        setDescripcion('');
        setIdCategoria('');
      } else {
        setError(result.message || 'Error desconocido al crear servicio');
      }
    } catch (err) {
      setError(`Error al crear servicio: ${err.message}`);
    }
  };

  return (
    <div className="mt-4">
      <h3 className="h4 mb-3">Gestionar Servicios</h3>
      <form onSubmit={handleCrearServicio} className="mb-3">
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
        <div className="mb-3">
          <label className="form-label">Categoría</label>
          <select
            value={idCategoria}
            onChange={(e) => setIdCategoria(e.target.value)}
            className="form-select"
            required
          >
            <option value="">Seleccione una categoría</option>
            {categorias.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.nombre}</option>
            ))}
          </select>
        </div>
        <button type="submit" className="btn btn-success w-100">
          Crear Servicio
        </button>
      </form>
      <h4 className="h5">Servicios Existentes</h4>
      <ul className="list-group mt-2">
        {servicios.map((serv) => (
          <li key={serv.id} className="list-group-item">
            {serv.nombre} - {serv.descripcion}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GestionarServicios;