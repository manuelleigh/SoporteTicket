import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import useLocalStorage from '../hooks/useLocalStorage';
import apiService from '../services/apiService';

function Registro() {
  const navigate = useNavigate();
  const { user, addNotification } = useAppContext();
  const tituloRef = useRef(null);

  // Estados para el formulario controlado
  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    categoria: '',
    prioridad: '',
    usuario: user.name
  });

  // Estados para validación
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Estado de carga
  const [loading, setLoading] = useState(false);

  // Custom Hook para guardar borrador en localStorage
  const [draft, saveDraft] = useLocalStorage('ticket-draft', null);

  // useEffect para enfocar el primer campo al cargar
  useEffect(() => {
    if (tituloRef.current) {
      tituloRef.current.focus();
    }

    // Cargar borrador si existe
    if (draft) {
      setFormData(draft);
      addNotification('Se ha restaurado un borrador guardado', 'info');
    }
  }, []);

  // useEffect para guardar borrador automáticamente
  useEffect(() => {
    if (formData.titulo || formData.descripcion) {
      saveDraft(formData);
    }
  }, [formData]);

  // Validación de campos
  const validateField = (name, value) => {
    let error = '';

    switch (name) {
      case 'titulo':
        if (!value.trim()) {
          error = 'El título es obligatorio';
        } else if (value.trim().length < 5) {
          error = 'El título debe tener al menos 5 caracteres';
        } else if (value.trim().length > 100) {
          error = 'El título no puede exceder 100 caracteres';
        }
        break;

      case 'descripcion':
        if (!value.trim()) {
          error = 'La descripción es obligatoria';
        } else if (value.trim().length < 10) {
          error = 'La descripción debe tener al menos 10 caracteres';
        } else if (value.trim().length > 500) {
          error = 'La descripción no puede exceder 500 caracteres';
        }
        break;

      case 'categoria':
        if (!value) {
          error = 'Debes seleccionar una categoría';
        }
        break;

      case 'prioridad':
        if (!value) {
          error = 'Debes seleccionar una prioridad';
        }
        break;

      default:
        break;
    }

    return error;
  };

  // Validar todos los campos
  const validateForm = () => {
    const newErrors = {};
    Object.keys(formData).forEach(key => {
      if (key !== 'usuario') {
        const error = validateField(key, formData[key]);
        if (error) {
          newErrors[key] = error;
        }
      }
    });
    return newErrors;
  };

  // Manejar cambios en inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Validar campo si ya fue tocado
    if (touched[name]) {
      const error = validateField(name, value);
      setErrors(prev => ({
        ...prev,
        [name]: error
      }));
    }
  };

  // Manejar blur (cuando el usuario sale del campo)
  const handleBlur = (e) => {
    const { name, value } = e.target;
    
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));

    const error = validateField(name, value);
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };

  // Manejar envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Marcar todos los campos como tocados
    const allTouched = {};
    Object.keys(formData).forEach(key => {
      allTouched[key] = true;
    });
    setTouched(allTouched);

    // Validar formulario
    const formErrors = validateForm();
    setErrors(formErrors);

    // Si hay errores, no enviar
    if (Object.keys(formErrors).length > 0) {
      addNotification('Por favor corrige los errores en el formulario', 'warning');
      return;
    }

    // Enviar datos
    setLoading(true);
    try {
      const response = await apiService.add(formData);
      
      addNotification('¡Ticket creado exitosamente!', 'success');
      
      // Limpiar formulario
      setFormData({
        titulo: '',
        descripcion: '',
        categoria: '',
        prioridad: '',
        usuario: user.name
      });
      setErrors({});
      setTouched({});
      
      // Limpiar borrador
      saveDraft(null);

      // Redirigir a la lista
      setTimeout(() => {
        navigate('/lista');
      }, 1500);
    } catch (error) {
      addNotification('Error al crear el ticket. Por favor intenta nuevamente.', 'danger');
    } finally {
      setLoading(false);
    }
  };

  // Limpiar formulario
  const handleReset = () => {
    setFormData({
      titulo: '',
      descripcion: '',
      categoria: '',
      prioridad: '',
      usuario: user.name
    });
    setErrors({});
    setTouched({});
    saveDraft(null);
    tituloRef.current?.focus();
  };

  return (
    <div className="row">
      <div className="col-lg-8 mx-auto">
        <div className="card shadow-lg border-0">
          <div className="card-header bg-primary text-white">
            <h3 className="mb-0">➕ Crear Nuevo Ticket</h3>
          </div>
          <div className="card-body p-4">
            <form onSubmit={handleSubmit} noValidate>
              {/* Usuario */}
              <div className="mb-3">
                <label className="form-label">Usuario</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.usuario}
                  disabled
                />
              </div>

              {/* Título */}
              <div className="mb-3">
                <label htmlFor="titulo" className="form-label">
                  Título del Ticket <span className="text-danger">*</span>
                </label>
                <input
                  ref={tituloRef}
                  type="text"
                  className={`form-control ${errors.titulo && touched.titulo ? 'is-invalid' : ''} ${!errors.titulo && touched.titulo && formData.titulo ? 'is-valid' : ''}`}
                  id="titulo"
                  name="titulo"
                  value={formData.titulo}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Ej: Error al iniciar sesión"
                  maxLength="100"
                />
                {errors.titulo && touched.titulo && (
                  <div className="invalid-feedback">{errors.titulo}</div>
                )}
                <small className="text-muted">
                  {formData.titulo.length}/100 caracteres
                </small>
              </div>

              {/* Descripción */}
              <div className="mb-3">
                <label htmlFor="descripcion" className="form-label">
                  Descripción del Problema <span className="text-danger">*</span>
                </label>
                <textarea
                  className={`form-control ${errors.descripcion && touched.descripcion ? 'is-invalid' : ''} ${!errors.descripcion && touched.descripcion && formData.descripcion ? 'is-valid' : ''}`}
                  id="descripcion"
                  name="descripcion"
                  value={formData.descripcion}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  rows="4"
                  placeholder="Describe detalladamente el problema o consulta..."
                  maxLength="500"
                />
                {errors.descripcion && touched.descripcion && (
                  <div className="invalid-feedback">{errors.descripcion}</div>
                )}
                <small className="text-muted">
                  {formData.descripcion.length}/500 caracteres
                </small>
              </div>

              {/* Categoría */}
              <div className="mb-3">
                <label htmlFor="categoria" className="form-label">
                  Categoría <span className="text-danger">*</span>
                </label>
                <select
                  className={`form-select ${errors.categoria && touched.categoria ? 'is-invalid' : ''} ${!errors.categoria && touched.categoria && formData.categoria ? 'is-valid' : ''}`}
                  id="categoria"
                  name="categoria"
                  value={formData.categoria}
                  onChange={handleChange}
                  onBlur={handleBlur}
                >
                  <option value="">Selecciona una categoría</option>
                  <option value="tecnico">Soporte Técnico</option>
                  <option value="facturacion">Facturación</option>
                  <option value="consulta">Consulta General</option>
                  <option value="bug">Reporte de Bug</option>
                  <option value="mejora">Solicitud de Mejora</option>
                </select>
                {errors.categoria && touched.categoria && (
                  <div className="invalid-feedback">{errors.categoria}</div>
                )}
              </div>

              {/* Prioridad */}
              <div className="mb-4">
                <label htmlFor="prioridad" className="form-label">
                  Prioridad <span className="text-danger">*</span>
                </label>
                <select
                  className={`form-select ${errors.prioridad && touched.prioridad ? 'is-invalid' : ''} ${!errors.prioridad && touched.prioridad && formData.prioridad ? 'is-valid' : ''}`}
                  id="prioridad"
                  name="prioridad"
                  value={formData.prioridad}
                  onChange={handleChange}
                  onBlur={handleBlur}
                >
                  <option value="">Selecciona la prioridad</option>
                  <option value="baja">🟢 Baja</option>
                  <option value="media">🟡 Media</option>
                  <option value="alta">🟠 Alta</option>
                  <option value="critica">🔴 Crítica</option>
                </select>
                {errors.prioridad && touched.prioridad && (
                  <div className="invalid-feedback">{errors.prioridad}</div>
                )}
              </div>

              {/* Botones */}
              <div className="d-flex gap-2">
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Creando...
                    </>
                  ) : (
                    '✓ Crear Ticket'
                  )}
                </button>
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={handleReset}
                  disabled={loading}
                >
                  🔄 Limpiar
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Notificaciones */}
        <div className="position-fixed bottom-0 end-0 p-3" style={{ zIndex: 11 }}>
          {/* Las notificaciones se manejan en el contexto */}
        </div>
      </div>
    </div>
  );
}

export default Registro;
