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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-green-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-2xl p-8 space-y-8 bg-white rounded-2xl shadow-xl border border-blue-100">
        <div className="text-center">
          <div className="flex justify-center">
            <img
              src="src/assets/consentidos1.jpg"
              alt="Logo Consentidos"
              className="h-20 w-auto mb-4"
            />
          </div>
          <h2 className="mt-2 text-3xl font-extrabold text-gray-900">
            Regístrate en Consentidos
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            IPS Veterinaria - Cuidamos a tus mascotas como se merecen
          </p>
        </div>

        <form onSubmit={handleRegister} className="mt-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="tipoUsuario" className="block text-sm font-medium text-gray-700">
                Tipo de Usuario
              </label>
              <select
                id="tipoUsuario"
                value={tipoUsuario}
                onChange={(e) => setTipoUsuario(e.target.value)}
                className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                required
              >
                <option value="">Seleccione un tipo</option>
                <option value="Administrador">Administrador</option>
                <option value="AtencionAlCliente">Atención al Cliente</option>
                <option value="Autonomo">Autónomo</option>
                <option value="Empresa">Empresa</option>
                <option value="Dueno">Dueño de Mascota</option>
              </select>
            </div>

            <div>
              <label htmlFor="correo" className="block text-sm font-medium text-gray-700">
                Correo electrónico
              </label>
              <input
                id="correo"
                type="email"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                placeholder="tucorreo@ejemplo.com"
                required
              />
            </div>

            <div>
              <label htmlFor="contrasena" className="block text-sm font-medium text-gray-700">
                Contraseña
              </label>
              <input
                id="contrasena"
                type="password"
                value={contrasena}
                onChange={(e) => setContrasena(e.target.value)}
                className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                placeholder="••••••••"
                required
              />
            </div>

            <div>
              <label htmlFor="nid" className="block text-sm font-medium text-gray-700">
                Número de Identificación
              </label>
              <input
                id="nid"
                type="text"
                value={nid}
                onChange={(e) => setNid(e.target.value)}
                className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                placeholder="Ej: 123456789"
                required
              />
            </div>

            <div>
              <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">
                Nombre
              </label>
              <input
                id="nombre"
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                placeholder={tipoUsuario === 'Empresa' ? 'Nombre de la empresa' : 'Tu nombre'}
                required
              />
            </div>

            {tipoUsuario !== 'Empresa' && (
              <div>
                <label htmlFor="apellido" className="block text-sm font-medium text-gray-700">
                  Apellido
                </label>
                <input
                  id="apellido"
                  type="text"
                  value={apellido}
                  onChange={(e) => setApellido(e.target.value)}
                  className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                  placeholder="Tu apellido"
                  required
                />
              </div>
            )}

            <div className="flex items-center">
              <input
                id="activo"
                type="checkbox"
                checked={activo}
                onChange={(e) => setActivo(e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="activo" className="ml-2 block text-sm text-gray-900">
                Cuenta activa
              </label>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-lg font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200"
            >
              <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                <svg className="h-5 w-5 text-blue-300 group-hover:text-blue-200" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </span>
              Registrar cuenta
            </button>
          </div>
        </form>

        {success && <Alert type="success" message={success} />}
        {error && <Alert type="error" message={error} />}

        <div className="text-center text-sm text-gray-600">
          <p>
            ¿Ya tienes una cuenta?{' '}
            <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
              Inicia sesión aquí
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;