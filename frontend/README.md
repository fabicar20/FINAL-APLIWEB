# Frontend - Sistema de Inventario de Laboratorio

Aplicación web desarrollada con React y Vite para consumir la API REST del backend.

## Requisitos

- Node.js
- npm
- Backend Laravel corriendo en `http://127.0.0.1:8000`

## Instalación

Instalar dependencias:

```bash
npm install
```

Levantar servidor frontend:

```bash
npm run dev
```

La aplicación quedará disponible normalmente en:

```text
http://localhost:5173
```

## Conexión con backend

El cliente HTTP está configurado en:

```text
src/api/axios.js
```

URL base:

```js
http://127.0.0.1:8000/api
```

## Credenciales de prueba

Administrador:

```text
Correo: admin@lab.com
Contraseña: 123456
```

Usuario general:

```text
Se puede registrar desde la opción "Crear cuenta".
```

## Funcionalidades

- Inicio de sesión
- Registro de usuarios
- Panel de inventario
- Creación, edición y eliminación de equipos para administradores
- Solicitud de préstamos
- Gestión de solicitudes
- Aprobación, rechazo y devolución de préstamos
- Filtros y búsquedas
