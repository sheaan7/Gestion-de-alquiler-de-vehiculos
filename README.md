# Gestión de alquiler de vehiculos

Sistema de alquiler de vehículos con arquitectura de microservicios.  
Incluye frontend web, descubrimiento de servicios con Eureka, enrutamiento por Gateway y despliegue completo con Docker Compose.

## Arquitectura

### Componentes principales

| Componente | Puerto | Responsabilidad |
|---|---:|---|
| `frontend` | 3000 | Interfaz web para listar vehículos, alquilar y cancelar operaciones |
| `gateway` | 8080 | Punto único de entrada para APIs, ruteo a microservicios |
| `eureka-server` | 8761 | Registro y descubrimiento de servicios |
| `servicio-vehiculos` | 8081 | CRUD de vehículos, búsquedas y gestión de estado |
| `servicio-operaciones` | 8082 | Gestión de alquiler/cancelación consultando `servicio-vehiculos` |
| `mysql` | 3306 | Persistencia relacional para `servicio-vehiculos` |

### Flujo de comunicación

1. El usuario interactúa con el `frontend`.
2. El frontend consume el `gateway`.
3. El `gateway` enruta solicitudes hacia `servicio-vehiculos` y `servicio-operaciones`.
4. `servicio-operaciones` valida disponibilidad y actualiza estado en `servicio-vehiculos`.
5. Todos los servicios se registran en `eureka-server`.

## Estructura del repositorio

```text
.
├── docker-compose.yml
├── frontend/
├── gateway/
├── eureka-server/
├── servicio-vehiculos/
├── servicio-operaciones/
├── scripts/
└── docs/
```

## Requisitos previos

- Docker 24+ y Docker Compose v2
- (Opcional) Node.js 20+ para ejecutar frontend fuera de contenedores
- (Opcional) Java 21 + Maven para pruebas locales de microservicios

## Deploy del proyecto

### 1. Levantar todo el stack

```bash
docker compose up -d --build
```

### 2. Verificar estado de contenedores

```bash
docker compose ps
```

### 3. Endpoints esperados

- Eureka: `http://localhost:8761`
- Gateway: `http://localhost:8080`
- Frontend: `http://localhost:3000`
- phpMyAdmin: `http://localhost:8085`

## Validación post-deploy

```bash
curl -fsS http://localhost:8761 >/dev/null
curl -fsS http://localhost:8080/api/vehiculos >/dev/null
curl -fsS http://localhost:8080/api/operaciones >/dev/null
curl -fsS http://localhost:3000 >/dev/null
```

## Comandos útiles

### Ver logs

```bash
docker compose logs -f gateway
```

### Reiniciar stack

```bash
docker compose down
docker compose up -d --build
```

## Troubleshooting

### Error de permisos Docker socket

Si aparece `permission denied while trying to connect to the docker API`, ejecuta con un usuario con permisos de Docker o ajusta permisos del grupo `docker`.

### Puertos ocupados

Si un puerto ya está en uso (`3000`, `8080`, `8081`, `8082`, `8085`, `8761`, `3306`), libera el puerto o cambia mapeos en `docker-compose.yml`.

### Servicio en estado `unhealthy`

1. Revisar logs del contenedor afectado.
2. Confirmar que dependencias estén arriba (`mysql`, `eureka-server`).
3. Ejecutar nuevamente:

```bash
docker compose up -d --build
```
