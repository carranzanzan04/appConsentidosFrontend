import { useState, useEffect, useCallback } from 'react';

const GestionarMascotas = ({ mascotas = [], loadMascotas, setSuccess, setError, userId }) => {
  const [tipos, setTipos] = useState([]);
  const [razas, setRazas] = useState([]);
  const [nombre, setNombre] = useState('');
  const [tipoId, setTipoId] = useState('');
  const [razaId, setRazaId] = useState('');
  const [peso, setPeso] = useState('');
  const [fechaNacimiento, setFechaNacimiento] = useState('');
  const [editId, setEditId] = useState(null);

  // Cargar tipos iniciales
  const loadTipos = useCallback(async () => {
    try {
      const tiposResponse = await fetch('/MicroServicioMascotas/mascotas/tipos', {
        method: 'GET',
        headers: { 'Accept': 'application/json', 'Cache-Control': 'no-cache' },
      });
      if (!tiposResponse.ok) throw new Error(`Error al cargar tipos: HTTP ${tiposResponse.status}`);
      const tiposData = await tiposResponse.json();
      console.log('Tipos recibidos:', tiposData); // Log para depuración
      setTipos(Array.isArray(tiposData) ? tiposData : []);
      setError(''); // Limpiar errores previos
    } catch (err) {
      setError(err.message);
      console.error('Error al cargar tipos:', err); // Log para errores
    }
  }, [setError]);

  // Cargar razas cuando cambia el tipo
  const fetchRazasByTipo = useCallback(async (tipoId) => {
    if (!tipoId) {
      setRazas([]);
      return;
    }
    try {
      const response = await fetch(`/MicroServicioMascotas/mascotas/razas/${tipoId}`, {
        method: 'GET',
        headers: { 'Accept': 'application/json', 'Cache-Control': 'no-cache' },
      });
      if (!response.ok) throw new Error(`Error al cargar razas: HTTP ${response.status}`);
      const razasData = await response.json();
      console.log('Razas recibidas:', razasData); // Log para depuración
      setRazas(Array.isArray(razasData) ? razasData : []);
      setError(''); // Limpiar errores previos
    } catch (err) {
      setError(err.message);
      console.error('Error al cargar razas:', err); // Log para errores
    }
  }, [setError]);

  useEffect(() => {
    if (userId && userId !== 'undefined') {
      loadTipos();
    }
  }, [userId, loadTipos]);

  useEffect(() => {
    fetchRazasByTipo(tipoId);
  }, [tipoId, fetchRazasByTipo]);

  const handleCrearMascota = async (e) => {
    e.preventDefault();
    if (!userId || isNaN(parseInt(userId))) {
      setError('ID de usuario no válido');
      return;
    }
    if (!nombre || nombre.length < 2 || nombre.length > 50) {
      setError('El nombre debe tener entre 2 y 50 caracteres');
      return;
    }
    if (!tipoId) {
      setError('Selecciona un tipo');
      return;
    }
    if (!razaId) {
      setError('Selecciona una raza');
      return;
    }
    if (!peso || parseFloat(peso) <= 0) {
      setError('El peso debe ser mayor que 0');
      return;
    }
    const today = new Date();
    const birthDate = new Date(fechaNacimiento);
    if (!fechaNacimiento || birthDate > today) {
      setError('La fecha de nacimiento no puede ser futura');
      return;
    }

    try {
      const tipo = tipos.find(t => t._id === tipoId);
      const raza = razas.find(r => r._id === razaId);
      const mascotaData = {
        nombre,
        raza: {
          _id: razaId,
          nombre: raza.nombre,
          tipo_id: tipoId,
          tipo: { _id: tipo._id, nombre: tipo.nombre },
        },
        peso: parseFloat(peso),
        fecha_de_nacimiento: new Date(fechaNacimiento).toISOString(),
        dueno_id: parseInt(userId),
      };

      let url, method;
      if (editId) {
        url = `/MicroServicioMascotas/mascotas/update/${editId}`;
        method = 'PUT';
        mascotaData._id = editId;
      } else {
        url = `/MicroServicioMascotas/mascotas/crear/${userId}`;
        method = 'POST';
      }

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mascotaData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error al guardar mascota: HTTP ${response.status} - ${errorText || 'No se recibió mensaje de error'}`);
      }

      const result = await response.json();
      console.log('Resultado de guardar mascota:', result); // Log detallado para depuración

      // Considerar la operación exitosa si la respuesta es HTTP 200/201, incluso sin success
      setSuccess(result.message || (editId ? 'Mascota actualizada' : 'Mascota creada'));
      loadMascotas(); // Recargar la lista de mascotas
      // Limpiar formulario
      setNombre('');
      setTipoId('');
      setRazaId('');
      setPeso('');
      setFechaNacimiento('');
      setEditId(null);
    } catch (err) {
      setError(`Error al guardar mascota: ${err.message}`);
      console.error('Error en handleCrearMascota:', err); // Log para errores
    }
  };

  const handleEditarMascota = (mascota) => {
    setNombre(mascota.nombre);
    setTipoId(mascota.raza.tipo_id);
    setRazaId(mascota.raza._id);
    setPeso(mascota.peso.toString());
    setFechaNacimiento(mascota.fecha_de_nacimiento.split('T')[0]);
    setEditId(mascota._id);
  };

  const handleEliminarMascota = async (id) => {
    try {
      const response = await fetch(`/MicroServicioMascotas/mascotas/delete/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error al eliminar mascota: HTTP ${response.status} - ${errorText || 'No se recibió mensaje de error'}`);
      }

      const result = await response.json();
      console.log('Resultado de eliminar mascota:', result); // Log detallado para depuración

      // Considerar la operación exitosa si la respuesta es HTTP 200/204, incluso sin success
      setSuccess(result.message || 'Mascota eliminada');
      loadMascotas(); // Recargar la lista de mascotas
    } catch (err) {
      setError(`Error al eliminar mascota: ${err.message}`);
      console.error('Error en handleEliminarMascota:', err); // Log para errores
    }
  };

  return (
    <div className="mt-4">
      <h3 className="h4 mb-3">Gestionar Mascotas</h3>
      <form onSubmit={handleCrearMascota} className="mb-3">
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
          <label className="form-label">Tipo</label>
          <select
            className="form-control"
            value={tipoId}
            onChange={(e) => {
              setTipoId(e.target.value);
              setRazaId('');
            }}
            required
          >
            <option value="">Seleccione un tipo</option>
            {tipos.map((tipo) => (
              <option key={tipo._id} value={tipo._id}>{tipo.nombre}</option>
            ))}
          </select>
        </div>
        <div className="mb-3">
          <label className="form-label">Raza</label>
          <select
            className="form-control"
            value={razaId}
            onChange={(e) => setRazaId(e.target.value)}
            disabled={!tipoId}
            required
          >
            <option value="">Seleccione una raza</option>
            {razas.map((raza) => (
              <option key={raza._id} value={raza._id}>{raza.nombre}</option>
            ))}
          </select>
        </div>
        <div className="mb-3">
          <label className="form-label">Peso (kg)</label>
          <input
            type="number"
            value={peso}
            onChange={(e) => setPeso(e.target.value)}
            className="form-control"
            required
            min="0.1"
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Fecha de Nacimiento</label>
          <input
            type="date"
            value={fechaNacimiento}
            onChange={(e) => setFechaNacimiento(e.target.value)}
            className="form-control"
            required
            max={new Date().toISOString().split('T')[0]}
          />
        </div>
        <button type="submit" className="btn btn-success w-100">
          {editId ? 'Actualizar Mascota' : 'Crear Mascota'}
        </button>
        {editId && (
          <button
            type="button"
            className="btn btn-secondary w-100 mt-2"
            onClick={() => {
              setNombre('');
              setTipoId('');
              setRazaId('');
              setPeso('');
              setFechaNacimiento('');
              setEditId(null);
            }}
          >
            Cancelar Edición
          </button>
        )}
      </form>
      <h4 className="h5">Mascotas Existentes</h4>
      {mascotas.length === 0 ? (
        <div className="alert alert-info text-center mt-2">No hay mascotas registradas.</div>
      ) : (
        <table className="table table-striped table-hover mt-2">
          <thead className="table-dark">
            <tr>
              <th>Nombre</th>
              <th>Tipo</th>
              <th>Raza</th>
              <th>Peso (kg)</th>
              <th>Fecha de Nacimiento</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {mascotas.map((mascota) => (
              <tr key={mascota._id}>
                <td>{mascota.nombre}</td>
                <td>{mascota.raza?.tipo?.nombre || 'Desconocido'}</td>
                <td>{mascota.raza?.nombre || 'Desconocido'}</td>
                <td>{mascota.peso}</td>
                <td>{new Date(mascota.fecha_de_nacimiento).toLocaleDateString()}</td>
                <td>
                  <button
                    className="btn btn-warning btn-sm me-2"
                    onClick={() => handleEditarMascota(mascota)}
                  >
                    Editar
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleEliminarMascota(mascota._id)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default GestionarMascotas;