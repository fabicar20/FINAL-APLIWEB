# Pruebas Manuales del Sistema

## Objetivo

Verificar el funcionamiento básico del sistema web de gestión de inventario y solicitudes de laboratorio.

## Entorno de prueba

- Backend: Laravel 9
- Frontend: React + Vite
- Base de datos: MySQL/MariaDB con XAMPP
- Navegador: Google Chrome / Microsoft Edge

## Checklist de pruebas

| Prueba                      | Descripción                                                  | Resultado esperado                                                     | Estado   |
| --------------------------- | ------------------------------------------------------------ | ---------------------------------------------------------------------- | -------- |
| Registro de usuario         | Crear una cuenta nueva desde el formulario de registro       | El usuario se registra correctamente y entra al sistema                | Aprobado |
| Inicio de sesión            | Ingresar con correo y contraseña válidos                     | El sistema redirige al dashboard                                       | Aprobado |
| Cierre de sesión            | Presionar el botón cerrar sesión                             | El usuario sale del sistema y vuelve al login                          | Aprobado |
| Visualización de inventario | Consultar la sección de inventario                           | Se listan los equipos registrados                                      | Aprobado |
| Crear equipo                | Registrar un equipo desde usuario administrador              | El equipo aparece en la lista de inventario                            | Aprobado |
| Editar equipo               | Modificar nombre, categoría, cantidad o estado               | Los datos se actualizan correctamente                                  | Aprobado |
| Eliminar equipo             | Eliminar un equipo desde usuario administrador               | El equipo desaparece del inventario                                    | Aprobado |
| Buscar equipo               | Buscar por nombre, código o categoría                        | El sistema muestra los equipos que coinciden                           | Aprobado |
| Crear solicitud             | Solicitar un préstamo desde una tarjeta de equipo            | Se crea una solicitud en estado pendiente                              | Aprobado |
| Listar solicitudes          | Entrar a la sección de solicitudes                           | Se muestran las solicitudes registradas                                | Aprobado |
| Filtrar solicitudes         | Filtrar por estado pendiente, aprobada, rechazada o devuelta | Se muestran solo las solicitudes del estado elegido                    | Aprobado |
| Aprobar solicitud           | Administrador aprueba una solicitud pendiente                | La solicitud cambia a aprobada y baja la disponibilidad                | Aprobado |
| Rechazar solicitud          | Administrador rechaza una solicitud pendiente                | La solicitud cambia a rechazada                                        | Aprobado |
| Registrar devolución        | Administrador registra devolución de una solicitud aprobada  | La solicitud cambia a devuelta y sube la disponibilidad                | Aprobado |
| Validar permisos admin      | Entrar como usuario normal                                   | No se muestran opciones de crear, editar, eliminar, aprobar o rechazar | Aprobado |
| Validar disponibilidad      | Solicitar más unidades que las disponibles                   | El backend rechaza la solicitud                                        | Aprobado |
| Ruta protegida              | Consultar `/api/me` sin token                                | El backend no permite acceder al recurso                               | Aprobado |

## Prueba de autenticación con token

Se verificó que el backend genera un token después del login y que este token permite acceder a rutas protegidas mediante el encabezado:

```text
Authorization: Bearer TOKEN
Accept: application/json
```

## Prueba de roles

Se probaron dos tipos de usuario:

### Administrador

Puede:

- Crear equipos.
- Editar equipos.
- Eliminar equipos.
- Ver todas las solicitudes.
- Aprobar solicitudes.
- Rechazar solicitudes.
- Registrar devoluciones.

### Usuario general

Puede:

- Ver inventario.
- Buscar equipos.
- Crear solicitudes de préstamo.
- Ver sus solicitudes.

No puede:

- Crear equipos.
- Editar equipos.
- Eliminar equipos.
- Aprobar solicitudes.
- Rechazar solicitudes.
- Registrar devoluciones.

## Conclusión de pruebas

Las pruebas manuales realizadas demuestran que el sistema cumple con las funcionalidades principales solicitadas: autenticación, permisos por rol, gestión de inventario, solicitudes de préstamo, aprobación, rechazo, devolución, control de disponibilidad e historial.
