# Apuntes generales del backend IntelliPark

## Propósito

Este documento reúne apuntes base del desarrollo del backend de **IntelliPark**, un sistema de gestión de parqueaderos construido con Node.js, Express y PostgreSQL.

## Conceptos base

| Herramienta | Explicación sencilla | Uso en IntelliPark |
|---|---|---|
| **Node.js** | Entorno donde se ejecuta JavaScript del lado del servidor. | Ejecutar la API backend. |
| **Express** | Framework para crear servidores web y APIs. | Crear rutas REST como `/api/auth/login` o `/api/parking/check-in`. |
| **dotenv** | Carga variables desde un archivo `.env`. | Guardar puerto, credenciales de base de datos, JWT secret y otras claves. |
| **pg** | Librería para conectar Node.js con PostgreSQL. | Ejecutar consultas SQL desde el backend. |
| **Pool** | Administrador de conexiones a la base de datos. | Reutilizar conexiones y evitar abrir una nueva conexión por cada petición. |
| **nodemon** | Herramienta de desarrollo que reinicia el servidor al guardar cambios. | Agilizar pruebas durante el desarrollo. |

## Flujo general de una petición

```txt
Cliente / Postman / Frontend
↓
Express
↓
Routes
↓
Controller
↓
Service
↓
Database / pg
↓
PostgreSQL
```

## Estructura base del proyecto

```txt
intellipark-api/
  src/
    app.js
    server.js
    config/
      database.js
    routes/
    controllers/
    services/
    database/
    middlewares/
    utils/
  migracion/
  .env
  .gitignore
  package.json
  README.md
```

## Responsabilidad de archivos iniciales

| Archivo | Responsabilidad |
|---|---|
| `package.json` | Define dependencias, scripts y configuración básica del proyecto. |
| `.env` | Guarda variables sensibles o configurables. No debe subirse al repositorio. |
| `.gitignore` | Evita subir `node_modules`, `.env`, `.scannerwork` y otros archivos locales. |
| `src/app.js` | Configura Express, middlewares y rutas base. |
| `src/server.js` | Levanta el servidor en el puerto configurado. |
| `src/config/database.js` | Centraliza la conexión a PostgreSQL usando `pg`. |

## Estado del backend al corte 2026-05-28 19:43

Ya se tenía avanzado:

1. Configuración inicial del proyecto.
2. Conexión a PostgreSQL.
3. Registro de usuarios.
4. Login con JWT.
5. Middleware de autenticación.
6. Middleware de roles.
7. Módulo de usuarios.
8. Módulo de vehículos.
9. Ingreso de vehículos / check-in.

## Pendientes identificados para terminar el MVP

### 1. Módulo de salida de vehículos

Endpoint principal:

```txt
POST /api/parking/check-out
```

Debe permitir:

- Buscar un vehículo por placa.
- Validar que tenga un ingreso activo.
- Calcular el tiempo de permanencia.
- Calcular el valor a pagar por hora o fracción.
- Actualizar el registro como finalizado.
- Guardar hora de salida, minutos totales y valor total.

Regla principal:

> Un vehículo solo puede salir si tiene un ingreso activo.

### 2. Definición de tarifa

Tarifa inicial sugerida para MVP:

| Tipo de vehículo | Tarifa por hora o fracción |
|---|---:|
| Carro | $3.000 / $3.500 según decisión del proyecto |
| Moto | $2.000 |

En la primera versión la tarifa puede manejarse desde el servicio. Más adelante puede evolucionar a una tabla `parking_rates`.

### 3. Módulo de pagos

Endpoints sugeridos:

```txt
POST /api/payments
GET /api/payments
GET /api/payments/:id
GET /api/payments/parking/:parkingId
```

Regla principal:

> No permitir pago duplicado para el mismo registro de parqueo.

### 4. Módulo de reportes básicos

Endpoint flexible recomendado:

```txt
GET /api/reports/income?from=2026-05-01&to=2026-05-31
```

Debe permitir consultar:

- Total de ingresos.
- Cantidad de pagos.
- Total por método de pago.
- Total por tipo de vehículo.

Regla principal:

> Los reportes financieros deben basarse en la tabla `payments`.
