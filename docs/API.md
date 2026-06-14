# Documentación API REST

## URL base

```text
http://127.0.0.1:8000/api
```

## Autenticación

La API usa Laravel Sanctum. Las rutas protegidas requieren el encabezado:

```text
Authorization: Bearer TOKEN
Accept: application/json
```

## Registro

**POST** `/register`

Body:

```json
{
  "name": "Estudiante Demo",
  "email": "estudiante@lab.com",
  "password": "123456",
  "password_confirmation": "123456"
}
```

Respuesta:

```json
{
  "message": "Usuario registrado correctamente",
  "user": {},
  "token": "..."
}
```

## Login

**POST** `/login`

Body:

```json
{
  "email": "admin@lab.com",
  "password": "123456"
}
```

Respuesta:

```json
{
  "message": "Inicio de sesión correcto",
  "user": {},
  "token": "..."
}
```

## Usuario autenticado

**GET** `/me`

Requiere token.

## Cerrar sesión

**POST** `/logout`

Requiere token.

## Listar equipos

**GET** `/equipment`

Parámetros opcionales:

```text
search
status
```

Ejemplo:

```text
/equipment?search=microscopio
```

## Crear equipo

**POST** `/equipment`

Requiere token de administrador.

Body:

```json
{
  "name": "Microscopio",
  "code": "LAB-001",
  "category": "Equipo óptico",
  "description": "Microscopio para prácticas",
  "quantity": 5,
  "available_quantity": 5,
  "status": "available"
}
```

## Ver equipo

**GET** `/equipment/{id}`

## Actualizar equipo

**PUT** `/equipment/{id}`

Requiere token de administrador.

## Eliminar equipo

**DELETE** `/equipment/{id}`

Requiere token de administrador.

## Listar solicitudes

**GET** `/loan-requests`

Requiere token.

Parámetros opcionales:

```text
status
```

Valores:

```text
pending
approved
rejected
returned
```

## Crear solicitud de préstamo

**POST** `/loan-requests`

Requiere token.

Body:

```json
{
  "equipment_id": 1,
  "quantity": 1,
  "observations": "Solicitud para práctica de laboratorio"
}
```

## Aprobar solicitud

**POST** `/loan-requests/{id}/approve`

Requiere token de administrador.

## Rechazar solicitud

**POST** `/loan-requests/{id}/reject`

Requiere token de administrador.

## Registrar devolución

**POST** `/loan-requests/{id}/return`

Requiere token de administrador.
