import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Alert from './Alert';

const Login = () => {
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setSuccess('');
    setError('');

    try {
      const response = await fetch('/MicroServicioLogin/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ correo, contrasena })
      });
      const result = await response.json();
      if (result.success) {
        setSuccess(result.message);
        localStorage.setItem('userRole', result.role);
        localStorage.setItem('userCorreo', result.correo);
        localStorage.setItem('userId',result.id);
        localStorage.setItem('nombre',result.nombre);
        if(result.role !== 'empresa'){
          localStorage.setItem('apellido', result.apellido);
        }

        setTimeout(() => navigate('/dashboard'), 2000);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('Error al iniciar sesión: ' + err.message);
    }
  };

  return (
    <div className="container mt-5">
      <div className="card mx-auto" style={{ maxWidth: '400px' }}>
        <div className="card-body">
          <h2 className="card-title text-center mb-4">Iniciar Sesión en AppMascotas</h2>
          <form onSubmit={handleLogin} className="mb-3">
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
            <button type="submit" className="btn btn-primary w-100">
              Iniciar Sesión
            </button>
          </form>
          {success && <Alert type="success" message={success} />}
          {error && <Alert type="error" message={error} />}
          <p className="text-center mt-3">
            ¿No tienes cuenta? <Link to="/register" className="text-decoration-none text-primary">Regístrate</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;