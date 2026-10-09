# IntelliPark API

Backend REST API para el sistema de gestión de parqueaderos **IntelliPark**, desarrollado con Node.js y Express como proyecto formativo del programa ADSO en el SENA.

---

## Tecnologías

| Tecnología           | Uso                                        |
|----------------------|--------------------------------------------|
| Node.js              | Entorno de ejecución del servidor          |
| Express.js v5        | Framework web para la API REST             |
| PostgreSQL            | Base de datos relacional                   |
| `pg`                 | Cliente PostgreSQL para Node.js            |
| `bcrypt`             | Cifrado de contraseñas                     |
| `jsonwebtoken`       | Autenticación mediante tokens JWT          |
| `swagger-jsdoc`      | Generación de especificación OpenAPI 3.0   |
| `swagger-ui-express` | Interfaz visual de la documentación        |
| `cors`               | Habilitación de solicitudes entre dominios |
| `dotenv`             | Gestión de variables de entorno            |
| `nodemon`            | Reinicio automático en desarrollo          |

---

## Estructura del proyecto

```
intelliParkApi/
├── docs/                              # Documentación interna del proyecto
├── src/
│   ├── config/
│   │   ├── database.js                # Pool de conexión a PostgreSQL
│   │   └── swagger.js                 # Configuración de OpenAPI 3.0
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── parking.controller.js
│   │   ├── payments.controller.js
│   │   ├── reports.controller.js
│   │   ├── users.controller.js
│   │   └── vehicles.controller.js
│   ├── database/
│   │   ├── parking.db.js              # Consultas SQL — registros de parqueo
│   │   ├── payments.db.js             # Consultas SQL — pagos
│   │   ├── reports.db.js              # Consultas SQL — reportes
│   │   ├── users.db.js                # Consultas SQL — usuarios
│   │   └── vehicles.db.js             # Consultas SQL — vehículos
│   ├── middlewares/
│   │   ├── auth.middleware.js         # Verificación de token JWT
│   │   ├── error.middleware.js        # Manejadores 404 y 500
│   │   ├── role.middleware.js         # Control de acceso por rol
│   │   └── validate.middleware.js     # Validación de entrada por endpoint
│   ├── migrations/
│   │   ├── 21-05-2026-users.sql
│   │   ├── 28-05-2026-1-vehicles.sql
│   │   ├── 28-05-2026-2-parking_records.sql
│   │   └── 02-06-2026-payments.sql
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── parking.routes.js
│   │   ├── payments.routes.js
│   │   ├── reports.routes.js
│   │   ├── users.routes.js
│   │   └── vehicles.routes.js
│   ├── services/
│   │   ├── auth.service.js
│   │   ├── parking.service.js
│   │   ├── payments.service.js
│   │   ├── reports.service.js
│   │   └── vehicles.service.js
│   ├── utils/
│   │   ├── jwt.util.js                # Generación y verificación de tokens
│   │   └── password.util.js           # Hash y comparación de contraseñas
│   ├── app.js                         # Configuración de Express (middlewares y rutas)
│   └── server.js                      # Punto de entrada: arranca el servidor
├── .env                               # Variables de entorno (no se sube al repositorio)
├── .env.example                       # Plantilla de variables de entorno
├── .gitignore
└── package.json
```

---

## Requisitos previos

- [Node.js](https://nodejs.org/) v18 o superior
- [PostgreSQL](https://www.postgresql.org/) v14 o superior
- npm v9 o superior

---

## Instalación

1. Clonar el repositorio:

```bash
git clone <url-del-repositorio>
cd intelliParkApi
```

2. Instalar las dependencias:

```bash
npm install
```

3. Configurar las variables de entorno:

```bash
cp .env.example .env
```

Luego editar el archivo `.env` con los valores correspondientes (ver sección [Variables de entorno](#variables-de-entorno)).

4. Crear la base de datos y ejecutar las migraciones (ver sección [Base de datos](#base-de-datos)).

---

## Variables de entorno

El archivo `.env` debe contener las siguientes variables:

```env
# Servidor
PORT=3000

# Base de datos PostgreSQL
DB_HOST=localhost
DB_PORT=5432
DB_NAME=intellipark_db
DB_USER=tu_usuario_db
DB_PASSWORD=tu_contraseña_db

# Autenticación JWT
JWT_SECRET=tu_clave_secreta_jwt
JWT_EXPIRES_IN=1h
```

> **Nunca subas el archivo `.env` al repositorio.** Está incluido en `.gitignore`.

---

## Base de datos

### 1. Crear la base de datos

Conectarse a PostgreSQL con un cliente como `psql` o pgAdmin y ejecutar:

```sql
CREATE DATABASE intellipark_db;
```

### 2. Ejecutar las migraciones

Las migraciones se encuentran en `src/migrations/` y deben ejecutarse **en el orden indicado**, ya que cada tabla depende de las anteriores mediante llaves foráneas.

```bash
# Conectarse a la base de datos recién creada
psql -U tu_usuario_db -d intellipark_db
```

Una vez conectado, ejecutar cada archivo en este orden:

```sql
-- 1. Tabla de usuarios (no tiene dependencias)
\i src/migrations/21-05-2026-users.sql

-- 2. Tabla de vehículos (depende de users)
\i src/migrations/28-05-2026-1-vehicles.sql

-- 3. Tabla de registros de parqueo (depende de vehicles y users)
\i src/migrations/28-05-2026-2-parking_records.sql

-- 4. Tabla de pagos (depende de parking_records y users)
\i src/migrations/02-06-2026-payments.sql
```

> Si usas pgAdmin u otro cliente gráfico, puedes abrir y ejecutar cada archivo SQL en el mismo orden.

### 3. Diagrama de tablas

```
users
  └── vehicles          (vehicle_created_by → users.user_id)
        └── parking_records  (parking_vehicle_id → vehicles.vehicle_id)
                              (parking_created_by → users.user_id)
              └── payments   (payment_parking_id → parking_records.parking_id)
                              (payment_created_by → users.user_id)
```

### 4. Tipos ENUM definidos en la BD

| ENUM               | Valores posibles                                |
|--------------------|--------------------------------------------------|
| `roles`            | `operador`, `administrador`                      |
| `vehicle_types`    | `carro`, `moto`                                  |
| `parking_statuses` | `activo`, `finalizado`, `cancelado`              |
| `payment_methods`  | `efectivo`, `transferencia`, `tarjeta`, `otro`   |

### 5. Restricciones importantes

- Un vehículo solo puede tener **un registro de parqueo activo** a la vez (índice único parcial sobre `parking_records`).
- Un registro de parqueo solo puede tener **un pago** asociado (columna `payment_parking_id UNIQUE`).
- Solo se pueden pagar registros con estado `finalizado` (validado en la capa de servicio).

---

## Ejecución

**Modo desarrollo** (con reinicio automático):

```bash
npm run dev
```

**Modo producción:**

```bash
npm start
```

El servidor se inicia por defecto en `http://localhost:3000`.

---

## Documentación interactiva

La API cuenta con documentación Swagger generada automáticamente con OpenAPI 3.0.

| URL                                     | Descripción                          |
|-----------------------------------------|--------------------------------------|
| `http://localhost:3000/api/docs`        | Interfaz visual Swagger UI           |
| `http://localhost:3000/api/docs.json`   | Especificación OpenAPI en JSON       |

Desde Swagger UI se pueden probar todos los endpoints directamente en el navegador. Los endpoints protegidos requieren ingresar el token JWT con el botón **Authorize** (`Bearer <token>`).

---

## Endpoints disponibles

### Autenticación — `/api/auth`

| Método | Ruta                  | Descripción                        | Acceso     |
|--------|-----------------------|------------------------------------|------------|
| POST   | `/user-register`      | Registrar un nuevo usuario         | Público    |
| POST   | `/user-login`         | Iniciar sesión y obtener token JWT | Público    |
| GET    | `/user-me`            | Obtener el usuario autenticado     | JWT        |

**Registro de usuario — body:**
```json
{
  "user_first_name": "Juan",
  "user_last_name": "Pérez",
  "user_email": "juan@correo.com",
  "user_password": "123456",
  "user_role": "operador"
}
```

**Login — body:**
```json
{
  "user_email": "juan@correo.com",
  "user_password": "123456"
}
```

---

### Usuarios — `/api/users`

> Requiere rol `administrador`.

| Método | Ruta                   | Descripción                          |
|--------|------------------------|--------------------------------------|
| GET    | `/`                    | Listar todos los usuarios            |
| GET    | `/:user_id`            | Consultar usuario por ID             |
| PATCH  | `/:user_id/status`     | Activar o desactivar una cuenta      |

**Actualizar estado — body:**
```json
{
  "user_active": false
}
```

---

### Vehículos — `/api/vehicles`

> Requiere rol `administrador` u `operador`.

| Método | Ruta              | Descripción                         |
|--------|-------------------|-------------------------------------|
| POST   | `/`               | Registrar un nuevo vehículo         |
| GET    | `/`               | Listar todos los vehículos          |
| GET    | `/plate/:plate`   | Consultar vehículo por placa        |
| GET    | `/:id`            | Consultar vehículo por ID           |

**Registrar vehículo — body:**
```json
{
  "vehicle_plate": "ABC123",
  "vehicle_type": "carro",
  "vehicle_brand": "Renault",
  "vehicle_color": "Gris"
}
```

---

### Parqueo — `/api/parking`

> Requiere rol `administrador` u `operador`.

| Método | Ruta          | Descripción                                            |
|--------|---------------|--------------------------------------------------------|
| POST   | `/check-in`   | Registrar ingreso de vehículo al parqueadero           |
| POST   | `/check-out`  | Registrar salida y calcular tarifa                     |
| GET    | `/active`     | Listar vehículos actualmente en el parqueadero         |

**Check-in — body:**
```json
{
  "vehicle_plate": "ABC123",
  "vehicle_type": "carro",
  "vehicle_brand": "Renault",
  "vehicle_color": "Gris"
}
```

> Si el vehículo no existe en el sistema, se crea automáticamente durante el check-in.

**Check-out — body:**
```json
{
  "vehicle_plate": "ABC123"
}
```

**Tarifas por hora:**

| Tipo       | Tarifa/hora |
|------------|-------------|
| Carro      | $3.000      |
| Moto       | $2.000      |
| Camioneta  | $4.000      |
| Otro       | $3.000      |

> Se cobra mínimo 1 hora. Las fracciones de hora se redondean hacia arriba.

---

### Pagos — `/api/payments`

> Requiere rol `administrador` u `operador`.

| Método | Ruta                    | Descripción                                      |
|--------|-------------------------|--------------------------------------------------|
| POST   | `/`                     | Registrar el pago de un parqueo finalizado       |
| GET    | `/`                     | Listar todos los pagos                           |
| GET    | `/parking/:parkingId`   | Consultar el pago de un registro de parqueo      |
| GET    | `/:id`                  | Consultar pago por ID                            |

**Registrar pago — body:**
```json
{
  "payment_parking_id": 1,
  "payment_method": "efectivo",
  "payment_reference": "REF-12345"
}
```

> Solo se pueden pagar registros de parqueo con estado `finalizado`. No se permiten pagos duplicados para el mismo parqueo.

---

### Reportes — `/api/reports`

> Requiere rol `administrador`.

| Método | Ruta       | Descripción                                           |
|--------|------------|-------------------------------------------------------|
| GET    | `/income`  | Reporte de ingresos agrupado por tipo de vehículo     |

**Parámetros de consulta opcionales:**

| Parámetro | Formato      | Descripción               |
|-----------|--------------|---------------------------|
| `from`    | `YYYY-MM-DD` | Fecha de inicio del rango |
| `to`      | `YYYY-MM-DD` | Fecha de fin del rango    |

Ejemplo: `GET /api/reports/income?from=2026-06-01&to=2026-06-30`

---

### Salud del servidor — `/api/health`

| Método | Ruta          | Descripción                                      | Acceso  |
|--------|---------------|--------------------------------------------------|---------|
| GET    | `/api/health` | Estado del servidor y conexión a la base de datos | Público |

**Respuesta exitosa (`200 OK`):**
```json
{
  "status": "ok",
  "message": "IntelliPark API está en funcionamiento.",
  "database": {
    "connected": true,
    "time": "2026-06-01T00:00:00.000Z"
  }
}
```

---

## Seguridad

### Autenticación JWT

Todos los endpoints (excepto `/user-register`, `/user-login` y `/api/health`) requieren un token JWT en el encabezado de la solicitud:

```
Authorization: Bearer <token>
```

El token se obtiene al hacer login exitoso y expira según el valor de `JWT_EXPIRES_IN` en `.env`.

### Roles y permisos

| Rol             | Permisos                                                              |
|-----------------|-----------------------------------------------------------------------|
| `administrador` | Acceso total: usuarios, vehículos, parqueo, pagos y reportes         |
| `operador`      | Acceso a vehículos, parqueo y pagos. Sin acceso a usuarios ni reportes |

---

## Autores

Proyecto formativo desarrollado en el **SENA** — Programa **Análisis y Desarrollo de Software (ADSO)**.
