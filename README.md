# Gestión de Alquiler de Vehículos

Sistema de alquiler de vehículos con arquitectura de microservicios.  
Backend en **Python / FastAPI**, frontend en **Next.js 15**, enrutamiento con **nginx** y despliegue completo con **Docker Compose**.

## Arquitectura

### Componentes

| Componente | Puerto | Tecnología | Responsabilidad |
|---|---:|---|---|
| `frontend` | 3000 | Next.js 15 + React 18 + Tailwind | Dashboard, flota, clientes, contratos, reservas, devoluciones, mantenimiento, reportes |
| `gateway` | 8080 | nginx | Punto único de entrada; enruta `/api/vehiculos`, `/api/operaciones` y `/api/clientes` |
| `servicio-vehiculos` | 8001 | Python 3.12 + FastAPI + SQLAlchemy | CRUD de vehículos (placa, marca, modelo, año, tipo, km, estado) + búsqueda |
| `servicio-operaciones` | 8002 | Python 3.12 + FastAPI | Registrar alquiler, cancelar operación; llama a `servicio-vehiculos` |
| `servicio-clientes` | 8003 | Python 3.12 + FastAPI + SQLAlchemy | CRUD de clientes (nombre, cédula/NIT, email, licencia, tipo) + búsqueda |
| `db` | 3306 | MySQL 8.4 | Persistencia relacional de vehículos y clientes |
| `phpmyadmin` | 8085 | phpMyAdmin 5 | Administración visual de la base de datos |

### Flujo de comunicación

```
Usuario → frontend:3000
           └─► gateway:8080 (nginx)
                 ├─► servicio-vehiculos:8001  (FastAPI + MySQL)
                 ├─► servicio-operaciones:8002 (FastAPI, en memoria)
                 │         └─► servicio-vehiculos:8001  (valida disponibilidad y actualiza estado)
                 └─► servicio-clientes:8003   (FastAPI + MySQL)
```

El frontend actúa como proxy interno: las llamadas del navegador van a `/api/...` en el propio servidor Next.js, que las reenvía al gateway usando la variable de entorno `URL_GATEWAY`.

### Modelo de datos — Vehículo

| Campo | Tipo | Descripción |
|---|---|---|
| `id` | int | Identificador autoincremental |
| `placa` | string | Placa única del vehículo (ej. `ABC-123`) |
| `marca` | string | Marca (ej. Toyota) |
| `modelo` | string | Modelo (ej. RAV4) |
| `anio` | int | Año de fabricación |
| `tipo` | string | SUV / Sedán / Camioneta / Van / Compacto / Lujo |
| `km_actuales` | int | Kilometraje actual |
| `estado` | enum | `DISPONIBLE` \| `NO_DISPONIBLE` |

### Modelo de datos — Cliente

| Campo | Tipo | Descripción |
|---|---|---|
| `id` | int | Identificador autoincremental |
| `nombre` | string | Nombre completo |
| `cedulaNit` | string | Cédula o NIT único |
| `telefono` | string | Teléfono de contacto |
| `email` | string | Correo electrónico único |
| `direccion` | string | Dirección de residencia |
| `licencia` | string | Categoría de licencia (ej. `B1`) |
| `tipoCliente` | string | Particular / Empresarial / Frecuente |
| `activo` | bool | Estado del cliente |

## Estructura del repositorio

```text
.
├── docker-compose.yml
├── frontend/               # Next.js 15 (TypeScript, Tailwind CSS)
├── gateway/                # nginx reverse proxy
├── servicio-vehiculos/     # FastAPI + SQLAlchemy + MySQL
├── servicio-operaciones/   # FastAPI (almacenamiento en memoria)
├── servicio-clientes/      # FastAPI + SQLAlchemy + MySQL
├── scripts/
└── docs/
```

## Módulos del frontend

| Ruta | Descripción | Backend |
|---|---|---|
| `/` | Dashboard — stats, flota, operaciones, contratos y reservas recientes | Real |
| `/vehiculos` | Listado de flota con filtros | Real |
| `/admin` | CRUD completo de vehículos | Real |
| `/operaciones` | Historial de alquileres y cancelaciones | Real |
| `/clientes` | CRUD de clientes con búsqueda en tiempo real | Real |
| `/contratos` | Contratos por estado, acción de devolución | Mock |
| `/reservas` | Confirmar / cancelar reservas | Mock |
| `/devoluciones` | Historial de devoluciones | Mock |
| `/mantenimiento` | Registro y seguimiento de mantenimientos | Mock |
| `/reportes` | Resumen financiero y ranking de vehículos | Mixto |

> Los módulos marcados como **Mock** usan estado local tipado mientras no exista backend propio.

## Requisitos previos

- Docker 24+ y Docker Compose v2

> No se requiere Java, Node.js ni Python instalados localmente; todo corre dentro de contenedores.

## Levantar el proyecto

### Primera vez (limpiar volumen viejo si existía)

```bash
docker compose down -v
docker compose up --build
```

### Usos posteriores

```bash
docker compose up --build
```

### Verificar estado

```bash
docker compose ps
```

## URLs de acceso

| Servicio | URL |
|---|---|
| Frontend | http://localhost:3000 |
| Gateway (API) | http://localhost:8080 |
| phpMyAdmin | http://localhost:8085 |
| API Vehículos (directo) | http://localhost:8001/docs |
| API Operaciones (directo) | http://localhost:8002/docs |
| API Clientes (directo) | http://localhost:8003/docs |

> Los servicios FastAPI exponen documentación Swagger en `/docs`.

## Validación rápida

```bash
# Listar vehículos
curl http://localhost:8080/api/vehiculos

# Crear un vehículo
curl -X POST http://localhost:8080/api/vehiculos \
  -H "Content-Type: application/json" \
  -d '{"placa":"ABC-123","marca":"Toyota","modelo":"RAV4","anio":2023,"tipo":"SUV","km_actuales":15000,"estado":"DISPONIBLE"}'

# Alquilar
curl -X POST http://localhost:8080/api/operaciones/alquiler \
  -H "Content-Type: application/json" \
  -d '{"idVehiculo":1}'

# Listar clientes
curl http://localhost:8080/api/clientes

# Crear un cliente
curl -X POST http://localhost:8080/api/clientes \
  -H "Content-Type: application/json" \
  -d '{"nombre":"María García","cedulaNit":"52145789","telefono":"3001112233","email":"maria@gmail.com","direccion":"Cll 80 #15-20","licencia":"B1","tipoCliente":"Particular","activo":true}'

# Buscar clientes
curl "http://localhost:8080/api/clientes/buscar?q=María"
```

## Comandos útiles

```bash
# Ver logs de un servicio
docker compose logs -f servicio-clientes

# Reconstruir solo un servicio
docker compose up --build servicio-clientes

# Detener todo
docker compose down
```

## Troubleshooting

### `servicio-vehiculos` o `servicio-clientes` no inicia — Access denied

El volumen de MySQL tiene credenciales de una ejecución anterior. Solución:

```bash
docker compose down -v   # elimina el volumen
docker compose up --build
```

### Puerto ocupado

Si algún puerto (`3000`, `8080`, `8001`, `8002`, `8003`, `8085`, `3306`) ya está en uso, modifica el mapeo en `docker-compose.yml`:

```yaml
ports:
  - "NUEVO_PUERTO:PUERTO_INTERNO"
```

### Contenedor en estado `unhealthy`

```bash
docker logs <nombre-contenedor>
```
