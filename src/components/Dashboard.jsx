import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import DropdownMenu from './DropdownMenu';
import Alert from './Alert';
import GestionarCategorias from './GestionarCategorias';
import GestionarServicios from './GestionarServicios';
import GestionarMascotas from './GestionarMascotas';

const Dashboard = () => {
  const role = localStorage.getItem('userRole');
  const correo = localStorage.getItem('userCorreo');
  const id = localStorage.getItem('userId');
  const navigate = useNavigate();

  console.log('Valores de localStorage en Dashboard:', { role, correo, id }); // Log para depuración

  const [categorias, setCategorias] = useState([]);
  const [servicios, setServicios] = useState([]);
  const [currentSection, setCurrentSection] = useState('home');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

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
  }, []);

  const loadServicios = useCallback(async () => {
    try {
      const response = await fetch('/MicroservicioServicios/api/servicios/list', {
        method: 'GET',
        headers: { 'Accept': 'application/json' }
      });
      const result = await response.json();
      if (result.success) {
        setServicios(Array.isArray(result.servicios) ? result.servicios : []);
      } else {
        setServicios([]);
      }
    } catch (err) {
      setError('Error al cargar servicios: ' + err.message);
      setServicios([]);
    }
  }, []);

  useEffect(() => {
    if (!role) {
      navigate('/login');
    } else {
      loadCategorias();
      loadServicios();
    }
  }, [role, navigate, loadCategorias, loadServicios]);

  const handleLogout = () => {
    localStorage.removeItem('userRole');
    localStorage.removeItem('userCorreo');
    localStorage.removeItem('userId');
    navigate('/login');
  };

  const menuItems = {
    administrador: [
      { label: 'Inicio', onClick: () => setCurrentSection('home') },
      { label: 'Gestionar Categorías', onClick: () => setCurrentSection('categorias') },
      { label: 'Cerrar Sesión', onClick: handleLogout }
    ],
    atencion_al_cliente: [
      { label: 'Inicio', onClick: () => setCurrentSection('home') },
      { label: 'Ver Servicios', onClick: () => setCurrentSection('servicios') },
      { label: 'Cerrar Sesión', onClick: handleLogout }
    ],
    autonomo: [
      { label: 'Inicio', onClick: () => setCurrentSection('home') },
      { label: 'Gestionar Servicios', onClick: () => setCurrentSection('servicios') },
      { label: 'Cerrar Sesión', onClick: handleLogout }
    ],
    empresa: [
      { label: 'Inicio', onClick: () => setCurrentSection('home') },
      { label: 'Gestionar Servicios', onClick: () => setCurrentSection('servicios') },
      { label: 'Cerrar Sesión', onClick: handleLogout }
    ],
    dueno: [
      { label: 'Inicio', onClick: () => setCurrentSection('home') },
      { label: 'Servicios por Mascota', onClick: () => setCurrentSection('serviciosPorMascota') },
      { label: 'Cerrar Sesión', onClick: handleLogout }
    ]
  };

  if (!role) return null;

  if (role === 'dueno' && !id) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger">
          Error: No se encontró el ID del usuario. Por favor, inicia sesión nuevamente.
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="bg-primary text-white p-3 rounded d-flex justify-content-between align-items-center">
        <h2 className="h4 mb-0">Dashboard de {role}</h2>
        <div className="d-flex align-items-center">
          <span className="me-3">{correo}</span>
          <DropdownMenu items={menuItems[role] || []} />
        </div>
      </div>
      {success && <Alert type="success" message={success} />}
      {error && <Alert type="error" message={error} />}
      <div className="mt-4">
        {currentSection === 'home' && (
          <div>
            <h3 className="h4">Bienvenido, {role}</h3>
            <p className="text-muted">Usa el menú para navegar entre las opciones disponibles.</p>
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
          <GestionarServicios
            categorias={categorias}
            loadServicios={loadServicios}
            setSuccess={setSuccess}
            setError={setError}
            servicios={servicios}
            userId={id}
          />
        )}
        {currentSection === 'servicios' && role === 'atencion_al_cliente' && (
          <div className="mt-4">
            <h3 className="h4 mb-3">Lista de Servicios</h3>
            <ul className="list-group">
              {servicios.map((serv) => (
                <li key={serv.id} className="list-group-item">
                  {serv.nombre} - {serv.descripcion}
                </li>
              ))}
            </ul>
          </div>
        )}
        {currentSection === 'serviciosPorMascota' && role === 'dueno' && id && (
          <GestionarMascotas
            setSuccess={setSuccess}
            setError={setError}
            userId={id}
          />
        )}
      </div>
    </div>
  );
};

export default Dashboard;