import os
import uuid
import httpx
from fastapi import FastAPI, HTTPException
from schemas import EstadoOperacion, OperacionAlquiler, PeticionAlquiler

VEHICULOS_URL = os.getenv("VEHICULOS_URL", "http://servicio-vehiculos:8001")

app = FastAPI(title="Servicio Operaciones")

_operaciones: dict[str, OperacionAlquiler] = {}


@app.post("/api/operaciones/alquiler", response_model=OperacionAlquiler)
async def alquilar(peticion: PeticionAlquiler):
    async with httpx.AsyncClient() as client:
        resp = await client.get(f"{VEHICULOS_URL}/api/vehiculos/{peticion.idVehiculo}")
        if resp.status_code == 404:
            raise HTTPException(status_code=404, detail="Vehículo no encontrado")
        if not resp.is_success:
            raise HTTPException(status_code=502, detail="Error al consultar vehículos")

        vehiculo = resp.json()
        if vehiculo["estado"] != "DISPONIBLE":
            raise HTTPException(status_code=409, detail="Vehículo no disponible")

        patch = await client.patch(
            f"{VEHICULOS_URL}/api/vehiculos/{peticion.idVehiculo}/estado",
            json={"estado": "NO_DISPONIBLE"},
        )
        if not patch.is_success:
            raise HTTPException(status_code=502, detail="Error al actualizar estado del vehículo")

    operacion = OperacionAlquiler(
        idOperacion=str(uuid.uuid4()),
        idVehiculo=peticion.idVehiculo,
        estado=EstadoOperacion.CONFIRMADA,
    )
    _operaciones[operacion.idOperacion] = operacion
    return operacion


@app.post("/api/operaciones/{id_operacion}/cancelar", response_model=OperacionAlquiler)
async def cancelar(id_operacion: str):
    operacion = _operaciones.get(id_operacion)
    if not operacion:
        raise HTTPException(status_code=404, detail="Operación no encontrada")

    async with httpx.AsyncClient() as client:
        await client.patch(
            f"{VEHICULOS_URL}/api/vehiculos/{operacion.idVehiculo}/estado",
            json={"estado": "DISPONIBLE"},
        )

    operacion.estado = EstadoOperacion.CANCELADA
    return operacion


@app.get("/api/operaciones", response_model=list[OperacionAlquiler])
def listar():
    return list(_operaciones.values())
