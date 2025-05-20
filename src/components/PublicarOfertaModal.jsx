import { useState } from 'react';
import './PublicarOfertaModal.css'; // Asegúrate de tener estilos para el modal
 
const PublicarOfertaModal = ({
  servicio,
  isOpen,
  onClose,
  onOfertaPublicada,
  initialIdPrestador = ''
}) => {
  const [formData, setFormData] = useState({
    idPrestador: initialIdPrestador, // Usamos el valor inicial
    precioOferta: '',
    horarioInicio: '',
    horarioFin: '',
    diasDisponibles: [],
    cuposDisponibles: '',
    descripcionOferta: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
 
 
  // ... (resto del código permanece igual)
  const diasSemana = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
 
  // Efecto para obtener el ID del prestador del servicio de auth cuando no esté en modo manual
 
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
 
  const handleDiasChange = (dia) => {
    setFormData(prev => {
      const nuevosDias = prev.diasDisponibles.includes(dia)
        ? prev.diasDisponibles.filter(d => d !== dia)
        : [...prev.diasDisponibles, dia];
      return { ...prev, diasDisponibles: nuevosDias };
    });
  };
 
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
 
    // Validación básica
    if (!formData.idPrestador) {
      setError('El ID del prestador es requerido');
      setIsSubmitting(false);
      return;
    }
 
    try {
      const ofertaData = {
        servicioId: servicio.serviceId,
        idPrestador: initialIdPrestador,
        precioOferta: formData.precioOferta,
        horarioInicio: formData.horarioInicio,
        horarioFin: formData.horarioFin,
        diasDisponibles: formData.diasDisponibles,
        cuposDisponibles: formData.cuposDisponibles,
        descripcionOferta: formData.descripcionOferta
      };
 
      const response = await fetch('api/service-oferta/publicar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Importante para enviar cookies de sesión
        body: JSON.stringify(ofertaData),
      });
 
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al publicar la oferta');
      }
 
      onOfertaPublicada();
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };
 
  if (!isOpen) return null;
 
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}>×</button>
        <h2>Publicar Oferta: {servicio.serviceName}</h2>
       
        {error && <div className="error-message">{error}</div>}
       
        <form onSubmit={handleSubmit}>
         
          <div className="form-group">
            <label>Precio de oferta:</label>
            <input
              type="number"
              name="precioOferta"
              value={formData.precioOferta}
              onChange={handleChange}
              required
              min="0"
              step="0.01"
            />
          </div>
         
          <div className="form-group">
            <label>Horario de disponibilidad:</label>
            <div className="horario-container">
              <input
                type="time"
                name="horarioInicio"
                value={formData.horarioInicio}
                onChange={handleChange}
                required
              />
              <span>a</span>
              <input
                type="time"
                name="horarioFin"
                value={formData.horarioFin}
                onChange={handleChange}
                required
              />
            </div>
          </div>
         
          <div className="form-group">
            <label>Días disponibles:</label>
            <div className="dias-container">
              {diasSemana.map(dia => (
                <label key={dia} className="dia-checkbox">
                  <input
                    type="checkbox"
                    checked={formData.diasDisponibles.includes(dia)}
                    onChange={() => handleDiasChange(dia)}
                  />
                  {dia}
                </label>
              ))}
            </div>
          </div>
         
          <div className="form-group">
            <label>Cupos disponibles:</label>
            <input
              type="number"
              name="cuposDisponibles"
              value={formData.cuposDisponibles}
              onChange={handleChange}
              required
              min="1"
            />
          </div>
         
          <div className="form-group">
            <label>Descripción de la oferta:</label>
            <textarea
              name="descripcionOferta"
              value={formData.descripcionOferta}
              onChange={handleChange}
              required
            />
          </div>
         
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Publicando...' : 'Publicar Oferta'}
          </button>
        </form>
      </div>
    </div>
  );
};
 
export default PublicarOfertaModal;
 