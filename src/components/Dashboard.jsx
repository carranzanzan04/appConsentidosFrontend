import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import DropdownMenu from './DropdownMenu';
import Alert from './Alert';
import GestionarCategorias from './GestionarCategorias';
import GestionarServicios from './GestionarServicios';
import GestionarServicios2 from './GestionarServicios2';
import GestionarMascotas from './GestionarMascotas';

const Dashboard = () => {
  const role = localStorage.getItem('userRole');
  const correo = localStorage.getItem('userCorreo');
  const id = localStorage.getItem('userId');
  const nombre = localStorage.getItem('nombre');
  let apellido = '';
  if(role !== 'empresa'){
    apellido = localStorage.getItem('apellido');
  }
  const navigate = useNavigate();

  const [categorias, setCategorias] = useState([]);
  const [servicios, setServicios] = useState([]);
  const [mascotas, setMascotas] = useState([]);
  const [currentSection, setCurrentSection] = useState('home');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const loadMascotas = useCallback(async () => {
    try {
      const response = await fetch(`/MicroServicioMascotas/mascotas/dueno/${id}`, {
        method: 'GET',
        headers: { 'Accept': 'application/json', 'Cache-Control': 'no-cache' },
      });
      if (!response.ok) throw new Error(`Error al cargar mascotas: HTTP ${response.status}`);
      const data = await response.json();
      setMascotas(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message);
    }
  }, [id, setError]);

  const loadCategorias = useCallback(async () => {
    try {
      const response = await fetch('/MicroServicioCategorias/api/categorias/listar', {
        method: 'GET',
        headers: { 'Accept': 'application/json' }
      });
      const result = await response.json();
      setCategorias(Array.isArray(result) ? result : []);
    } catch (err) {
      setError('Error al cargar categorías: ' + err.message);
      setCategorias([]);
    }
  }, [setError]);

  const loadServicios = useCallback(async () => {
    try {
      const response = await fetch(`/api/servicio-servicio/servicio/${id}`, {
        method: 'GET',
        headers: { 'Accept': 'application/json' }
      });
      const result = await response.json();
      
      if (Array.isArray(result)) {
        setServicios(result);
      } else if (result.success && Array.isArray(result.servicios)) {
        setServicios(result.servicios);
      } else {
        setServicios([]);
      }
    } catch (err) {
      setError('Error al cargar servicios: ' + err.message);
      setServicios([]);
    }
  }, [id, setError]);

  useEffect(() => {
    if (!role) {
      navigate('/login');
    } else {
      loadCategorias();
      loadServicios();
      if (role === 'dueno' && id && id !== 'undefined') {
        loadMascotas();
      }
    }
  }, [role, id, navigate, loadCategorias, loadServicios, loadMascotas]);

  const handleLogout = () => {
    localStorage.removeItem('userRole');
    localStorage.removeItem('userCorreo');
    localStorage.removeItem('userId');
    localStorage.removeItem('nombre');
    if (role !== 'empresa') {
      localStorage.removeItem('apellido');
    }
    navigate('/login');
  };

  const menuItems = {
    administrador: [
      { label: 'Inicio', onClick: () => setCurrentSection('home'), icon: '🏠' },
      { label: 'Gestionar Categorías', onClick: () => setCurrentSection('categorias'), icon: '🗂️' },
      { label: 'Cerrar Sesión', onClick: handleLogout, icon: '🚪' }
    ],
    atencion_al_cliente: [
      { label: 'Inicio', onClick: () => setCurrentSection('home'), icon: '🏠' },
      { label: 'Ver Servicios', onClick: () => setCurrentSection('servicios'), icon: '🛎️' },
      { label: 'Cerrar Sesión', onClick: handleLogout, icon: '🚪' }
    ],
    autonomo: [
      { label: 'Inicio', onClick: () => setCurrentSection('home'), icon: '🏠' },
      { label: 'Gestionar Servicios', onClick: () => setCurrentSection('servicios'), icon: '💼' },
      { label: 'Cerrar Sesión', onClick: handleLogout, icon: '🚪' }
    ],
    empresa: [
      { label: 'Inicio', onClick: () => setCurrentSection('home'), icon: '🏠' },
      { label: 'Gestionar Servicios', onClick: () => setCurrentSection('servicios'), icon: '🏢' },
      { label: 'Cerrar Sesión', onClick: handleLogout, icon: '🚪' }
    ],
    dueno: [
      { label: 'Inicio', onClick: () => setCurrentSection('home'), icon: '🏠' },
      { label: 'Servicios por Mascota', onClick: () => setCurrentSection('serviciosPorMascota'), icon: '🐶' },
      { label: 'Cerrar Sesión', onClick: handleLogout, icon: '🚪' }
    ]
  };
  
  if (role === 'dueno' && !id) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full">
          <div className="text-red-500 text-lg font-semibold mb-4">
            Error: No se encontró el ID del usuario
          </div>
          <p className="text-gray-600 mb-4">Por favor, inicia sesión nuevamente.</p>
          <button 
            onClick={() => navigate('/login')}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition duration-200"
          >
            Ir a Iniciar Sesión
          </button>
        </div>
      </div>
    );
  }

  const getRoleName = (role) => {
    const roles = {
      administrador: 'Administrador',
      atencion_al_cliente: 'Atención al Cliente',
      autonomo: 'Profesional Autónomo',
      empresa: 'Empresa',
      dueno: 'Dueño de Mascota'
    };
    return roles[role] || role;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      {/* Header */}
      <header className="bg-blue-300 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center">
            <img 
              src="src/assets/consentidos2.png" 
              alt="Logo Consentidos" 
              className="h-12 w-auto mr-4"
            />
            <h1 className="text-xl font-bold text-gray-800">Consentidos IPS</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="hidden md:block">
              <span className="text-sm text-gray-600">Bienvenido,</span>
              <span className="ml-2 font-medium text-gray-900">
               {correo}
              </span>
              <span className="ml-2 px-2 py-1 text-xs font-semibold bg-blue-100 text-blue-800 rounded-full">
                {getRoleName(role)}
              </span>
            </div>
            <DropdownMenu items={menuItems[role] || []} />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {/* Alerts */}
        <div className="mb-6">
          {success && <Alert type="success" message={success} />}
          {error && <Alert type="error" message={error} />}
        </div>

        {/* Content Sections */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          {currentSection === 'home' && (
            <div className="p-6">
              <div className="flex flex-col md:flex-row items-center">
                <div className="md:w-1/2 mb-6 md:mb-0 md:pr-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">
                    Hola, {nombre}{apellido ? ` ${apellido}` : ''}!
                  </h2>
                  <p className="text-gray-600 mb-4">
                    Bienvenido al panel de control de {getRoleName(role)} de Consentidos IPS.
                  </p>
                  <p className="text-gray-600">
                    Desde aquí puedes gestionar {role === 'administrador' ? 'todas las categorías' : 
                    role === 'dueno' ? 'los servicios para tus mascotas' : 'tus servicios'}.
                  </p>
                </div>
                <div className="md:w-1/2">
                  <img 
                    src="/dashboard-hero.png" 
                    alt="Mascotas felices" 
                    className="rounded-lg shadow"
                  />
                </div>
              </div>
            </div>
          )}

          {currentSection === 'categorias' && role === 'administrador' && (
            <GestionarCategorias
              loadCategorias={loadCategorias}
              setSuccess={setSuccess}
              setError={setError}
              userId={id}
              categorias={categorias}
            />
          )}

          {currentSection === 'servicios' && (role === 'autonomo' || role === 'empresa') && (
            <GestionarServicios2
              categorias={categorias}
              loadServicios={loadServicios}
              setSuccess={setSuccess}
              setError={setError}
              servicios={servicios}
              userId={id}
            />
          )}

          {currentSection === 'servicios' && role === 'atencion_al_cliente' && (
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Lista de Servicios</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {servicios.map((serv) => (
                  <div key={serv.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition duration-200">
                    <h4 className="font-medium text-gray-900">{serv.nombre}</h4>
                    <p className="text-gray-600 text-sm mt-1">{serv.descripcion}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {currentSection === 'serviciosPorMascota' && role === 'dueno' && id && (
            <GestionarMascotas
              mascotas={mascotas}
              loadMascotas={loadMascotas}
              setSuccess={setSuccess}
              setError={setError}
              userId={id}
            />
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-8">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-500">
            &copy; {new Date().getFullYear()} Consentidos IPS Veterinaria. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;