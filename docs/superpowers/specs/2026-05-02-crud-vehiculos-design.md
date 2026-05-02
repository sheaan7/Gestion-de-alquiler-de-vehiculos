# CRUD Vehículos — Diseño

**Fecha:** 2026-05-02  
**Proyecto:** Sistema de Gestión de Alquiler de Vehículos  
**Alcance:** Agregar gestión completa de inventario (crear, editar, eliminar vehículos) al frontend

---

## Problema

El frontend solo permite listar vehículos y alquilarlos. No existe forma de crear, editar ni eliminar vehículos desde la UI, aunque el backend ya expone estos endpoints.

---

## Solución

### Arquitectura

Un componente modal (`VehiculoModal`) maneja los tres modos de operación (crear/editar/eliminar). El `page.tsx` orquesta el estado y delega el rendering del modal al componente. El route handler existente se extiende con PUT y DELETE.

### 1. Tipos — `src/types/vehiculo.ts`

Agregar:
```typescript
export interface VehiculoInput {
  marca: string;
  modelo: string;
  estado: EstadoVehiculo;
}
```

### 2. API Client — `src/lib/clienteApi.ts`

Agregar tres funciones:
- `crearVehiculo(input: VehiculoInput): Promise<Vehiculo>` → POST `/api/vehiculos`
- `actualizarVehiculo(id: number, input: VehiculoInput): Promise<Vehiculo>` → PUT `/api/vehiculos/{id}`
- `eliminarVehiculo(id: number): Promise<void>` → DELETE `/api/vehiculos/{id}`

Mismos patrones de manejo de errores que las funciones existentes (leer body del error, throw con mensaje descriptivo).

### 3. Route Handler — `src/app/api/[...path]/route.ts`

Agregar:
- `PUT` handler: proxea al gateway con body JSON
- `DELETE` handler: proxea al gateway sin body

### 4. Componente `VehiculoModal` — `src/components/VehiculoModal.tsx`

```typescript
type ModalConfig =
  | { modo: "crear" }
  | { modo: "editar"; vehiculo: Vehiculo }
  | { modo: "eliminar"; vehiculo: Vehiculo };

interface VehiculoModalProps {
  config: ModalConfig;
  procesando: boolean;
  onConfirmar: (input?: VehiculoInput) => void;
  onCerrar: () => void;
}
```

**Modo `crear`:** Formulario vacío con campos marca (text), modelo (text), estado (select). Botón "Crear".

**Modo `editar`:** Formulario pre-llenado con datos del vehículo. Botón "Guardar cambios".

**Modo `eliminar`:** Mensaje de confirmación "¿Eliminar [Marca Modelo]?". Botón "Eliminar" (rojo) y "Cancelar".

**UX común:**
- Backdrop semitransparente, clic fuera cierra si no está procesando
- Botón "✕" en esquina superior derecha
- Botón de confirmación muestra "Procesando..." y se deshabilita mientras `procesando === true`
- Validación básica: marca y modelo no pueden estar vacíos antes de enviar

### 5. Página — `src/app/page.tsx`

**Nuevo estado:**
```typescript
const [modalConfig, setModalConfig] = useState<ModalConfig | null>(null);
```

**Handlers nuevos:**
- `confirmarCrear(input: VehiculoInput)` → llama `crearVehiculo`, recarga datos, cierra modal
- `confirmarEditar(input: VehiculoInput)` → llama `actualizarVehiculo`, recarga datos, cierra modal
- `confirmarEliminar()` → llama `eliminarVehiculo`, recarga datos, cierra modal

Todos usan `setProcesando("modal")` durante la operación. El estado `mensaje` existente se reutiliza para feedback.

**Cambios UI en la tabla de vehículos:**
- Header del card: botón "+ Nuevo Vehículo" que abre `{ modo: "crear" }`
- Cada fila: botones "Editar" y "Eliminar" junto al botón "Alquilar" existente

---

## Archivos a crear/modificar

| Archivo | Acción |
|---------|--------|
| `frontend/src/types/vehiculo.ts` | Agregar `VehiculoInput` |
| `frontend/src/lib/clienteApi.ts` | Agregar crear, actualizar, eliminar |
| `frontend/src/app/api/[...path]/route.ts` | Agregar PUT y DELETE |
| `frontend/src/components/VehiculoModal.tsx` | Crear |
| `frontend/src/app/page.tsx` | Agregar estado modal, botones y handlers |

---

## Criterios de éxito

- Se puede crear un vehículo nuevo desde el frontend
- Se puede editar marca, modelo y estado de un vehículo existente
- Se puede eliminar un vehículo con confirmación
- Los mensajes de éxito/error son visualmente distintos (verde/rojo)
- Los botones del modal se deshabilitan durante operaciones
- Los tests existentes siguen pasando (`npm test`)
