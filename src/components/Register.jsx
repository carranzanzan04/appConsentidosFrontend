import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Alert from './Alert';

const Register = () => {
  const [tipoUsuario, setTipoUsuario] = useState('');
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [nid, setNid] = useState('');
  const [activo, setActivo] = useState(true);
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setSuccess('');
    setError('');

    const data = {
      tipo: tipoUsuario,
      correo,
      contrasena,
      nid,
      activo,
      nombre,
      ...(tipoUsuario !== 'Empresa' ? { apellido } : {})
    };

    const endpoint = tipoUsuario === 'Administrador' || tipoUsuario === 'AtencionAlCliente'
      ? '/MicroServicioLogin/api/users/register/staff'
      : '/MicroServicioLogin/api/users/register/client';

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const result = await response.json();
      if (result.success) {
        setSuccess(result.message);
        setTimeout(() => navigate('/login'), 2000);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('Error al registrar usuario: ' + err.message);
    }
  };

  return (
    <div className="container mt-5">
      <div className="card mx-auto" style={{ maxWidth: '400px' }}>
        <div className="card-body">
          <h2 className="card-title text-center mb-4">Registro en AppMascotas</h2>
          <form onSubmit={handleRegister} className="mb-3">
            <div className="mb-3">
              <label className="form-label">Tipo de Usuario</label>
              <select
                value={tipoUsuario}
                onChange={(e) => setTipoUsuario(e.target.value)}
                className="form-select"
                required
              >
                <option value="">Seleccione un tipo</option>
                <option value="Administrador">Administrador</option>
                <option value="AtencionAlCliente">Atención al Cliente</option>
                <option value="Autonomo">Autónomo</option>
                <option value="Empresa">Empresa</option>
                <option value="Dueno">Dueño</option>
              </select>
            </div>
            <div className="mb-3">
              <label className="form-label">Correo</label>
              <input
                type="email"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                className="form-control"
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Contraseña</label>
              <input
                type="password"
                value={contrasena}
                onChange={(e) => setContrasena(e.target.value)}
                className="form-control"
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">NID</label>
              <input
                type="text"
                value={nid}
                onChange={(e) => setNid(e.target.value)}
                className="form-control"
                required
              />
            </div>
            <div className="mb-3 form-check">
              <input
                type="checkbox"
                checked={activo}
                onChange={(e) => setActivo(e.target.checked)}
                className="form-check-input"
              />
              <label className="form-check-label">Activo</label>
            </div>
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
            {tipoUsuario !== 'Empresa' && (
              <div className="mb-3">
                <label className="form-label">Apellido</label>
                <input
                  type="text"
                  value={apellido}
                  onChange={(e) => setApellido(e.target.value)}
                  className="form-control"
                  required
                />
              </div>
            )}
            <button type="submit" className="btn btn-primary w-100">
              Registrar
            </button>
          </form>
          {success && <Alert type="success" message={success} />}
          {error && <Alert type="error" message={error} />}
          <p className="text-center mt-3">
            ¿Ya tienes cuenta? <Link to="/login" className="text-decoration-none text-primary">Inicia sesión</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;