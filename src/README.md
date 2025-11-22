# 🎫 Sistema de Gestión de Tickets de Soporte

Aplicación web funcional desarrollada con React (JSX) que integra componentes reutilizables, formularios controlados, navegación entre vistas, hooks y consumo de servicios REST.

## 📋 Características Implementadas

### ✅ Componentes Reutilizables
- **App.jsx**: Componente principal con estructura de la aplicación
- **Navbar.jsx**: Navegación con enlaces activos
- **Home.jsx**: Página de inicio con información del sistema
- **Registro.jsx**: Formulario para crear tickets
- **Lista.jsx**: Listado y gestión de tickets
- **Notifications.jsx**: Sistema de notificaciones toast

### ✅ Formularios Controlados
- Formulario de registro de tickets con validación en tiempo real
- Campos controlados con `useState`
- Validación de campos obligatorios
- Mensajes de error personalizados
- Contador de caracteres
- Estilos condicionales (is-valid/is-invalid)

### ✅ Navegación entre Vistas
- **react-router-dom** configurado con 3 rutas:
  - `/` - Página principal (Home)
  - `/registro` - Crear nuevo ticket (Registro)
  - `/lista` - Ver todos los tickets (Lista)
- Navegación con componente Link
- Indicador visual de ruta activa

### ✅ Hooks de React

#### useState
- Estado del formulario en Registro.jsx
- Estado de tickets en Lista.jsx
- Estado de carga y errores
- Estados de filtros y búsqueda

#### useEffect
- Cargar tickets al montar componente
- Enfocar campo de formulario automáticamente
- Guardar borrador automáticamente
- Sincronización con localStorage

#### useRef
- Referencia al campo de título para auto-foco
- Acceso directo a elementos del DOM

#### useContext
- **AppContext**: Contexto global compartido
  - Información del usuario autenticado
  - Configuración de tema
  - Sistema de notificaciones global

### ✅ Custom Hook
- **useLocalStorage**: Hook personalizado para persistencia
  - Guarda y recupera datos de localStorage
  - Sincronización entre pestañas
  - Manejo automático de JSON parse/stringify
  - Usado para guardar borradores de tickets

### ✅ Consumo de Servicios REST

#### apiService.js
Servicio completo con operaciones CRUD:

- **getAll()**: Obtener todos los tickets
- **getById(id)**: Obtener un ticket específico
- **add(ticketData)**: Crear nuevo ticket
- **update(id, ticketData)**: Actualizar ticket existente
- **remove(id)**: Eliminar ticket

#### Características:
- Simulación de API REST con delay de red realista
- Manejo de errores con try/catch
- Mensajes de confirmación
- Indicador de carga (Loading...)
- Operación DELETE implementada

### ✅ Bootstrap
- Bootstrap 5 integrado
- Componentes: cards, forms, buttons, badges, navbar
- Sistema de grid responsivo
- Clases de utilidad
- Estilos personalizados adicionales

### ✅ Validaciones
- Campos obligatorios marcados con (*)
- Validación en tiempo real
- Validación al salir del campo (onBlur)
- Longitud mínima y máxima
- Mensajes de error específicos
- Prevención de envío con errores

### ✅ Funcionalidades Adicionales
- **Filtros**: Por estado, prioridad y búsqueda de texto
- **Estadísticas**: Contadores de tickets por estado
- **Edición en línea**: Cambiar estado de tickets
- **Confirmación**: Diálogo antes de eliminar
- **Notificaciones**: Sistema toast con auto-dismiss
- **Persistencia**: Borrador guardado automáticamente
- **Categorización**: 5 categorías de tickets
- **Prioridades**: 4 niveles (baja, media, alta, crítica)
- **Estados**: 4 estados (abierto, en-progreso, resuelto, cerrado)

## 🚀 Tecnologías Utilizadas

- **React 18** (JSX - No TypeScript)
- **React Router DOM** - Navegación
- **Bootstrap 5** - Estilos
- **Axios** - Cliente HTTP
- **Context API** - Estado global
- **LocalStorage API** - Persistencia local

## 📁 Estructura del Proyecto

```
/
├── App.jsx                      # Componente principal
├── components/
│   ├── Navbar.jsx              # Navegación
│   └── Notifications.jsx       # Sistema de notificaciones
├── pages/
│   ├── Home.jsx                # Página de inicio
│   ├── Registro.jsx            # Formulario de tickets
│   └── Lista.jsx               # Listado de tickets
├── context/
│   └── AppContext.jsx          # Contexto global
├── hooks/
│   └── useLocalStorage.js      # Custom Hook
├── services/
│   └── apiService.js           # Servicios REST
└── styles/
    └── globals.css             # Estilos globales
```

## 🎯 Funcionalidades por Página

### Home (/)
- Bienvenida personalizada
- Tarjetas informativas
- Botones de acceso rápido
- Explicación del funcionamiento

### Registro (/registro)
- Formulario controlado completo
- 5 campos: Título, Descripción, Categoría, Prioridad, Usuario
- Validación en tiempo real
- Contador de caracteres
- Auto-guardado de borrador
- Auto-foco en primer campo
- Botones: Crear y Limpiar

### Lista (/lista)
- Listado de tickets en cards
- Filtros múltiples (estado, prioridad, búsqueda)
- Estadísticas en tiempo real
- Edición de estado
- Eliminación con confirmación
- Indicador de carga
- Actualización manual

## 🎨 Características de UI/UX

- Diseño responsive
- Cards con hover effects
- Badges de colores por estado/prioridad
- Iconos descriptivos
- Animaciones suaves
- Feedback visual constante
- Loading states
- Confirmaciones de acciones

## 📝 Notas de Implementación

- **Todo en JSX**: No se usa TypeScript (.tsx)
- **API Simulada**: Los datos se almacenan en memoria
- **Validación Completa**: Todos los campos son validados
- **Props**: Comunicación entre componentes padre-hijo
- **Context**: Estado global accesible en toda la app
- **LocalStorage**: Persistencia de borradores
- **Axios**: Preparado para API real (actualmente simulado)
