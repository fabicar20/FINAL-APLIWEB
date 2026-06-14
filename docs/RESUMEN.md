# Resumen del Proyecto

## Nombre del proyecto

Sistema Web de Gestión de Inventario y Solicitudes de Laboratorio

## Descripción general

El proyecto consiste en una aplicación web para administrar equipos y materiales de laboratorio. El sistema permite registrar usuarios, iniciar sesión, consultar inventario, crear solicitudes de préstamo, aprobar o rechazar solicitudes y registrar devoluciones.

La aplicación está orientada a dos tipos de usuarios: administradores y usuarios generales. Los administradores gestionan el inventario y las solicitudes, mientras que los usuarios generales pueden consultar equipos disponibles y solicitar préstamos.

## Tecnologías utilizadas

### Frontend

- React
- Vite
- React Router DOM
- Axios
- CSS personalizado responsivo

### Backend

- Laravel 9
- Laravel Sanctum
- API REST
- Eloquent ORM

### Base de datos

- MySQL / MariaDB mediante XAMPP

## Arquitectura general

El sistema está dividido en dos aplicaciones independientes:

- `frontend`: aplicación web desarrollada en React.
- `backend`: API REST desarrollada en Laravel.

El frontend consume los endpoints del backend mediante Axios. La comunicación se realiza usando formato JSON y autenticación por token.

## Modelo de datos

El sistema utiliza las siguientes entidades principales:

### Usuarios

Representan a las personas que usan el sistema. Cada usuario tiene un rol:

- `admin`: puede gestionar inventario y solicitudes.
- `user`: puede consultar inventario y crear solicitudes de préstamo.

Campos principales:

- Nombre
- Correo
- Contraseña
- Rol

### Equipos

Representan los equipos o materiales disponibles en el laboratorio.

Campos principales:

- Nombre
- Código
- Categoría
- Descripción
- Cantidad total
- Cantidad disponible
- Estado

### Solicitudes de préstamo

Representan las peticiones realizadas por los usuarios para usar equipos del laboratorio.

Campos principales:

- Usuario solicitante
- Equipo solicitado
- Cantidad solicitada
- Estado
- Fecha de solicitud
- Fecha de aprobación
- Fecha de devolución
- Observaciones

Estados posibles:

- `pending`: solicitud pendiente.
- `approved`: solicitud aprobada.
- `rejected`: solicitud rechazada.
- `returned`: equipo devuelto.

## Funcionalidades implementadas

### Autenticación

El sistema permite registrar usuarios e iniciar sesión. La autenticación se implementó con Laravel Sanctum, generando tokens de acceso para consumir las rutas protegidas de la API.

### Gestión de roles

Se implementaron dos roles principales:

- Administrador
- Usuario general

El rol administrador tiene acceso a funciones de gestión, mientras que el usuario general tiene permisos limitados.

### Gestión de inventario

El administrador puede:

- Crear equipos.
- Listar equipos.
- Editar equipos.
- Eliminar equipos.
- Buscar equipos por nombre, código o categoría.

Los usuarios generales pueden consultar el inventario y ver la disponibilidad.

### Solicitudes de préstamo

Los usuarios autenticados pueden crear solicitudes de préstamo indicando el equipo y la cantidad requerida.

### Aprobación y rechazo

El administrador puede aprobar o rechazar solicitudes pendientes. Cuando una solicitud es aprobada, el sistema descuenta automáticamente la cantidad solicitada de la disponibilidad del equipo.

### Devoluciones

El administrador puede registrar la devolución de un préstamo aprobado. Cuando se registra la devolución, el sistema aumenta nuevamente la cantidad disponible del equipo.

### Historial

El sistema conserva el historial de solicitudes con sus respectivos estados, permitiendo consultar solicitudes pendientes, aprobadas, rechazadas y devueltas.

### Filtros y búsquedas

Se implementaron búsquedas en el inventario y filtros por estado en el módulo de solicitudes.

## Seguridad

El sistema aplica varias medidas básicas de seguridad web:

- Contraseñas cifradas con hash.
- Autenticación mediante tokens.
- Protección de rutas sensibles.
- Middleware para validar permisos de administrador.
- Validaciones de entrada en el backend.
- Restricción de acciones administrativas según rol.

## Validaciones

El backend valida los datos enviados en las solicitudes. Por ejemplo:

- El nombre del equipo es obligatorio.
- El código del equipo debe ser único.
- La cantidad debe ser mayor o igual a 1.
- Solo se pueden solicitar equipos existentes.
- No se puede solicitar una cantidad mayor a la disponibilidad.
- Solo se pueden aprobar solicitudes pendientes.
- Solo se pueden devolver solicitudes aprobadas.

## Interfaz de usuario

La interfaz fue desarrollada en React con diseño responsivo. Incluye:

- Pantalla de inicio de sesión.
- Pantalla de registro.
- Panel principal.
- Sección de inventario.
- Sección de solicitudes.
- Formularios para gestión de equipos.
- Botones de acción según el rol del usuario.

El diseño busca ser claro, moderno e intuitivo, facilitando la navegación entre inventario y solicitudes.

## Decisiones de diseño e implementación

Se eligió Laravel para el backend porque facilita la creación de APIs REST, validaciones, autenticación y conexión con base de datos mediante Eloquent.

Se eligió React para el frontend porque permite construir interfaces dinámicas y reutilizables. Además, Axios facilita la conexión con la API REST.

La base de datos se implementó con MySQL/MariaDB usando XAMPP, ya que es una herramienta práctica para desarrollo local y compatible con Laravel.

La autenticación se implementó con Laravel Sanctum porque permite manejar tokens de acceso de manera sencilla y segura para aplicaciones tipo SPA.

## Conclusión

El sistema cumple con los requisitos principales del mini-proyecto, integrando frontend, backend y base de datos en una aplicación funcional. Permite administrar inventario, controlar disponibilidad, gestionar préstamos, aplicar autenticación, manejar permisos por rol y consultar historial de solicitudes.
