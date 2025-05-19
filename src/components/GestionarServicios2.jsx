import { useState } from 'react';
import './GestionarServicios2.css';
import defaultImage from '../assets/default.png';

const GestionarServicios2 = ({ categorias, loadServicios, setSuccess, setError, servicios = [], userId }) => {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [idCategoria, setIdCategoria] = useState('');
  const [serviceImage, setServiceImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCrearServicio = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    if (!userId || isNaN(parseInt(userId))) {
      setError('ID de prestador no válido');
      setIsSubmitting(false);
      return;
    }
    
    if (!idCategoria) {
      setError('Seleccione una categoría');
      setIsSubmitting(false);
      return;
    }
    
    if (serviceImage && !serviceImage.type.match('image.*')) {
      setError('Por favor suba un archivo de imagen válido (JPEG, PNG)');
      setIsSubmitting(false);
      return;
    }

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('id', userId);
      formDataToSend.append('serviceName', nombre);
      formDataToSend.append('serviceDescription', descripcion);
      formDataToSend.append('idcategoria', idCategoria);
      if (serviceImage) {
        formDataToSend.append('serviceImage', serviceImage);
      }

      const response = await fetch(`api/servicio-servicio/servicio/${userId}`, {
        method: 'POST',
        body: formDataToSend
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
        setServiceImage(null);
      } else {
        setError(result.message || 'Error desconocido al crear servicio');
      }
    } catch (err) {
      setError(`Error al crear servicio: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="gestionar-servicios-container">
      <h3 className="gestionar-servicios-title">Gestionar Servicios</h3>
      
      <form onSubmit={handleCrearServicio} className="servicio-form">
        <div className="form-group">
          <label htmlFor="nombre" className="form-label">Nombre del Servicio</label>
          <input
            id="nombre"
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="form-input"
            required
            placeholder="Ej: Reparación de computadoras"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="descripcion" className="form-label">Descripción</label>
          <textarea
            id="descripcion"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            className="form-textarea"
            required
            rows="4"
            placeholder="Describa en detalle el servicio que ofrece"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="categoria" className="form-label">Categoría</label>
          <select
            id="categoria"
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
        
        <div className="form-group">
          <label htmlFor="imagen" className="form-label">Imagen del Servicio (Opcional)</label>
          <input
            id="imagen"
            type="file"
            accept="image/*"
            onChange={(e) => setServiceImage(e.target.files[0])}
            className="form-file-input"
          />
          <small className="form-help-text">Formatos aceptados: JPEG, PNG</small>
        </div>
        
        <button 
          type="submit" 
          className="submit-button"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Creando...' : 'Crear Servicio'}
        </button>
      </form>
      
      <h4 className="servicios-existente-title">Servicios Existentes</h4>
      {console.log(servicios)}
      {servicios.length === 0 ? (
        <div className="no-servicios-message">
          No has creado ningún servicio aún.
        </div>
      ) : (
        <div className="servicios-grid">
          {servicios.map((servicio) => (
            <div key={servicio.serviceId} className="servicio-card">
              <div className="servicio-imagen-container">
                {servicio.serviceImage ? (
                  <img
                    src={`/api/servicio-servicio/servicio${servicio.serviceImage}`}
                    alt={servicio.serviceName}
                    className="servicio-imagen"
                    onError={(e) => {
                      e.target.src = defaultImage;
                      e.target.onerror = null; // Prevents infinite loop
                    }}
                  />
                ) : (
                  <div className="servicio-imagen-default">
                    <span>Sin imagen</span>
                  </div>
                )}
              </div>
              
              <div className="servicio-content">
                <h3 className="servicio-nombre">{servicio.serviceName}</h3>
                <p className="servicio-categoria">
                  <span className="categoria-badge">{categorias.find(cat => cat.id === servicio.serviceCategory)?.nombre}</span>
                </p>
                <p className="servicio-descripcion">{servicio.serviceDescription}</p>
                
                <button
                  className="publicar-button"
                  aria-label={`Publicar ${servicio.serviceName} como oferta`}
                >
                  Publicar como oferta
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GestionarServicios2;