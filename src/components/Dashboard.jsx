

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
  if(role!='empresa'){
         apellido = localStorage.getItem('apellido');
        }
  const navigate = useNavigate();

  console.log('Valores de localStorage en Dashboard:', { role, correo, id }); // Log para depuración

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
    console.log('Respuesta del backend:', result);

    // Si el backend devuelve un array directamente:
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
            <h3 className="h4">Bienvenido, {nombre}{apellido ? ` ${apellido}` : ''}</h3>
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
         {console.log('Servicios de :', servicios)}
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
            mascotas={mascotas}
            loadMascotas={loadMascotas}
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