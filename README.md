Sistema de Inventario de Laboratorio

API REST desarrollada con Laravel 9 para la gestión de inventario, usuarios y solicitudes de préstamo.



Capturas del Sistema

Inicio de Sesión

Pantalla principal de autenticación. El sistema maneja dos roles: Administrador y Usuario general. Cada rol tiene acceso a funcionalidades diferentes.

![login](https://github.com/fabicar20/FINAL-APLIWEB/blob/0cd7a5fb62e637c06c0772ab4c943f7acf0959e6/docs/pantallazos/01-login.png)


Registro de Usuario

Formulario para crear una nueva cuenta. Solicita nombre, correo, contraseña y confirmación de contraseña. Los nuevos usuarios se registran con rol de usuario general por defecto.

![registro](https://github.com/fabicar20/FINAL-APLIWEB/blob/0cd7a5fb62e637c06c0772ab4c943f7acf0959e6/docs/pantallazos/02-registro.png)


Inventario (Vista Administrador)

Panel principal del administrador. Permite agregar nuevos equipos con nombre, código, categoría, cantidad y descripción. Muestra todos los equipos registrados con su disponibilidad en tiempo real. Incluye buscador por nombre, código o categoría, y botones para editar, eliminar o solicitar préstamo de cada equipo.

![inventario](https://github.com/fabicar20/FINAL-APLIWEB/blob/0cd7a5fb62e637c06c0772ab4c943f7acf0959e6/docs/pantallazos/03-inventario-admin.png)

Solicitudes de Préstamo (Vista Administrador)

Panel de gestión de solicitudes. Muestra todas las solicitudes recibidas con su estado (Pendiente, Aprobada, Rechazada, Devuelta), el equipo solicitado, la cantidad, el nombre del solicitante y la fecha. El administrador puede aprobar o rechazar solicitudes pendientes. Al aprobar, la disponibilidad del equipo se actualiza automáticamente.

![solicitudes](https://github.com/fabicar20/FINAL-APLIWEB/blob/0cd7a5fb62e637c06c0772ab4c943f7acf0959e6/docs/pantallazos/04-solicitudes-admin.png)
