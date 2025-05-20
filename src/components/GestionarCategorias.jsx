import { useState } from 'react';

const GestionarCategorias = ({ loadCategorias, setSuccess, setError, userId, categorias = [] }) => {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCrearCategoria = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    
    if (!userId || isNaN(parseInt(userId))) {
      setError('ID de administrador no válido');
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch('/MicroServicioCategorias/api/categorias/crear', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          nombre, 
          descripcion, 
          id_administrador: parseInt(userId) 
        })
      });

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.success) {
        setSuccess('Categoría creada exitosamente');
        loadCategorias();
        setNombre('');
        setDescripcion('');
      } else {
        setError(result.message || 'Error al crear categoría');
      }
    } catch (err) {
      setError(`Error al conectar con el servidor: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden p-6">
      <div className="border-b border-gray-200 pb-4 mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Gestión de Categorías</h2>
        <p className="text-gray-600 mt-1">Crea y administra las categorías de servicios</p>
      </div>

      {/* Formulario de creación */}
      <div className="bg-blue-50 rounded-lg p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Nueva Categoría</h3>
        <form onSubmit={handleCrearCategoria}>
          <div className="mb-4">
            <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-1">
              Nombre de la categoría
            </label>
            <input
              id="nombre"
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
              placeholder="Ej: Consultas Médicas"
              required
            />
          </div>
          
          <div className="mb-6">
            <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700 mb-1">
              Descripción
            </label>
            <textarea
              id="descripcion"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
              rows="3"
              placeholder="Describe los servicios que incluye esta categoría"
              required
            />
          </div>
          
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-2 px-4 rounded-lg text-white font-medium transition duration-200 ${
              isSubmitting 
                ? 'bg-blue-400 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {isSubmitting ? 'Creando...' : 'Crear Categoría'}
          </button>
        </form>
      </div>

      {/* Listado de categorías */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Categorías Existentes</h3>
        
        {categorias.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <p className="text-gray-500">No hay categorías registradas aún</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categorias.map((cat) => (
              <div 
                key={cat.id} 
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition duration-200"
              >
                <h4 className="font-bold text-blue-600">{cat.nombre}</h4>
                <p className="text-gray-600 text-sm mt-1">{cat.descripcion}</p>
                <div className="mt-3 pt-2 border-t border-gray-100 flex justify-between items-center">
                  <span className="text-xs text-gray-500">ID: {cat.id}</span>
                  <button className="text-xs text-blue-600 hover:text-blue-800">
                    Editar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default GestionarCategorias;