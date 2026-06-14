# Backend - Sistema de Inventario de Laboratorio

API REST desarrollada con Laravel 9 para la gestión de inventario, usuarios y solicitudes de préstamo.

## Requisitos

- PHP 8.0 o superior
- Composer
- XAMPP con MySQL activo

## Instalación

Instalar dependencias:

```bash
composer install
```

Crear archivo de entorno:

```bash
cp .env.example .env
```

En Windows PowerShell también se puede usar:

```powershell
Copy-Item .env.example .env
```

Generar clave de aplicación:

```bash
php artisan key:generate
```

Configurar la base de datos en `.env`:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=laboratorio_inventario
DB_USERNAME=root
DB_PASSWORD=
```

Crear la base de datos en phpMyAdmin:

```text
laboratorio_inventario
```

Ejecutar migraciones:

```bash
php artisan migrate
```

Levantar servidor backend:

```bash
php artisan serve
```

La API quedará disponible en:

```text
http://127.0.0.1:8000/api
```

## Crear usuario administrador

Primero se registra un usuario desde el frontend o desde la API.

Luego se cambia su rol usando Tinker:

```bash
php artisan tinker
```

Dentro de Tinker:

```php
$user = App\Models\User::where('email', 'admin@lab.com')->first();
$user->role = 'admin';
$user->save();
exit
```

## Obtener token de acceso

Login desde PowerShell:

```powershell
Invoke-RestMethod -Uri "http://127.0.0.1:8000/api/login" `
  -Method POST `
  -Headers @{ "Accept" = "application/json" } `
  -Body @{
    email = "admin@lab.com"
    password = "123456"
  } | ConvertTo-Json -Depth 5
```

La respuesta incluye un campo:

```text
token
```

Ese token se usa en rutas protegidas:

```text
Authorization: Bearer TOKEN
Accept: application/json
```

## Probar usuario autenticado

```powershell
$token = "TOKEN_AQUI"

Invoke-RestMethod -Uri "http://127.0.0.1:8000/api/me" `
  -Method GET `
  -Headers @{
    "Accept" = "application/json"
    "Authorization" = "Bearer $token"
  } | ConvertTo-Json -Depth 5
```
