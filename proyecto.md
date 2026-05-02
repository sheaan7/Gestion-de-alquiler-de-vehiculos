# 1. Portada

**Proyecto:** Sistema de Gestión de Alquiler de Vehículos  
**Arquitectura:** Microservicios con Spring Boot, Gateway, Eureka, MySQL y Frontend Next.js  
**Repositorio:** `sheaan7/Gestion-de-alquiler-de-vehiculos`  
**Fecha:** 2026-05-02

---

# 2. Índice

1. Portada  
2. Índice  
3. Introducción  
4. Microservicio “vehículos”  
5. Microservicio “operaciones”  
6. Conclusiones

---

# 3. Introducción

El objetivo del sistema es gestionar de forma integral el alquiler de vehículos, permitiendo consultar inventario, registrar operaciones de alquiler y cancelar operaciones cuando sea necesario. La solución está diseñada bajo un enfoque de microservicios para separar responsabilidades, facilitar mantenimiento y permitir evolución independiente de cada dominio funcional.

La temática se eligió por su valor práctico y académico: el problema de alquiler de vehículos permite modelar procesos reales (disponibilidad, confirmación, cancelación), integrar varios servicios distribuidos y aplicar patrones modernos de arquitectura (API Gateway, descubrimiento de servicios y comunicación entre microservicios).

---

# 4. Microservicio “vehículos”

## 4.1 Responsabilidad

Gestiona el catálogo de vehículos: creación, consulta, actualización, eliminación, búsqueda y cambios de estado.

## 4.2 Modelo principal

```json
{
  "id": 1,
  "marca": "Toyota",
  "modelo": "Corolla",
  "estado": "DISPONIBLE"
}
```

Valores de `estado`: `DISPONIBLE`, `NO_DISPONIBLE`.

## 4.3 API REST

Base path (vía gateway): `/api/vehiculos`

| Endpoint | Método | Parámetros | Descripción | Respuesta exitosa |
|---|---|---|---|---|
| `/api/vehiculos` | GET | - | Lista todos los vehículos | `200 OK` + arreglo de vehículos |
| `/api/vehiculos/{idVehiculo}` | GET | `idVehiculo` (path) | Busca vehículo por ID | `200 OK` + vehículo |
| `/api/vehiculos` | POST | Body `Vehiculo` | Crea vehículo | `201 Created` + vehículo creado |
| `/api/vehiculos/{idVehiculo}` | PUT | `idVehiculo` (path), Body `Vehiculo` | Actualiza marca/modelo/estado | `200 OK` + vehículo actualizado |
| `/api/vehiculos/{idVehiculo}` | DELETE | `idVehiculo` (path) | Elimina vehículo | `204 No Content` |
| `/api/vehiculos/buscar` | GET | Query opcionales: `marca`, `modelo`, `estado` | Búsqueda por filtros | `200 OK` + arreglo |
| `/api/vehiculos/{idVehiculo}/estado` | PATCH | `idVehiculo` (path), Body `PeticionEstado` | Actualiza estado parcial | `200 OK` + vehículo |
| `/api/vehiculos/{idVehiculo}/estado` | PUT | `idVehiculo` (path), Body `PeticionEstado` | Reemplaza estado | `200 OK` + vehículo |

### Ejemplo 1: crear vehículo

**Request**
```http
POST /api/vehiculos
Content-Type: application/json
```
```json
{
  "marca": "Kia",
  "modelo": "Rio",
  "estado": "DISPONIBLE"
}
```

**Response (`201 Created`)**
```json
{
  "id": 7,
  "marca": "Kia",
  "modelo": "Rio",
  "estado": "DISPONIBLE"
}
```

### Ejemplo 2: actualizar estado

**Request**
```http
PUT /api/vehiculos/7/estado
Content-Type: application/json
```
```json
{
  "estado": "NO_DISPONIBLE"
}
```

**Response (`200 OK`)**
```json
{
  "id": 7,
  "marca": "Kia",
  "modelo": "Rio",
  "estado": "NO_DISPONIBLE"
}
```

---

# 5. Microservicio “operaciones”

## 5.1 Responsabilidad

Gestiona operaciones de alquiler y cancelación. Este microservicio no trabaja aislado: depende del microservicio “vehículos” para validar disponibilidad y sincronizar el estado de cada vehículo.

## 5.2 Modelo principal

```json
{
  "idOperacion": "b8e2b7ec-8f9d-4b58-b0f6-d8202b0b2f3f",
  "idVehiculo": 7,
  "estado": "CONFIRMADA"
}
```

Valores de `estado`: `CONFIRMADA`, `CANCELADA`.

## 5.3 API REST

Base path (vía gateway): `/api/operaciones`

| Endpoint | Método | Parámetros | Descripción | Respuesta exitosa |
|---|---|---|---|---|
| `/api/operaciones` | GET | - | Lista operaciones registradas | `200 OK` + arreglo de operaciones |
| `/api/operaciones/alquiler` | POST | Body `{ "idVehiculo": Long }` | Crea operación de alquiler | `200 OK` + operación confirmada |
| `/api/operaciones/{idOperacion}/cancelar` | POST | `idOperacion` (path) | Cancela operación existente | `200 OK` + operación cancelada |

## 5.4 Interacción con microservicio “vehículos”

Durante el alquiler:
1. `servicio-operaciones` consulta vehículo por ID en `servicio-vehiculos`.
2. Si no existe, responde `404 Not Found` (`Vehiculo no encontrado`).
3. Si existe pero no está disponible, responde `409 Conflict` (`Vehiculo no disponible`).
4. Si está disponible, solicita cambio de estado a `NO_DISPONIBLE`.
5. Registra la operación como `CONFIRMADA`.

Durante la cancelación:
1. Busca la operación por `idOperacion`.
2. Si no existe, responde `404 Not Found` (`Operacion no encontrada`).
3. Si existe, solicita cambio de estado del vehículo a `DISPONIBLE`.
4. Marca la operación como `CANCELADA`.

### Ejemplo 1: alquiler

**Request**
```http
POST /api/operaciones/alquiler
Content-Type: application/json
```
```json
{
  "idVehiculo": 7
}
```

**Response (`200 OK`)**
```json
{
  "idOperacion": "f2e0b4f6-6d3c-4f20-a45f-d09a95c83c1c",
  "idVehiculo": 7,
  "estado": "CONFIRMADA"
}
```

### Ejemplo 2: cancelar

**Request**
```http
POST /api/operaciones/f2e0b4f6-6d3c-4f20-a45f-d09a95c83c1c/cancelar
```

**Response (`200 OK`)**
```json
{
  "idOperacion": "f2e0b4f6-6d3c-4f20-a45f-d09a95c83c1c",
  "idVehiculo": 7,
  "estado": "CANCELADA"
}
```

---

# 6. Conclusiones

El proyecto implementa correctamente una arquitectura de microservicios para un caso realista de negocio, con separación clara entre inventario (`vehículos`) y lógica transaccional (`operaciones`). La presencia de Gateway y Eureka mejora la escalabilidad y el desacoplamiento, mientras que Docker Compose facilita despliegue y pruebas integradas.

Además, la interacción entre microservicios garantiza consistencia operativa: alquilar un vehículo impacta su disponibilidad y cancelar revierte el estado, manteniendo coherencia funcional en el sistema. En conjunto, la solución cumple el objetivo de ofrecer una base sólida, mantenible y extensible para gestión de alquiler de vehículos.
