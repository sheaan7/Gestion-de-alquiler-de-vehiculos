import os
import uuid
import httpx
from datetime import date
from fastapi import FastAPI, HTTPException, Depends
from sqlalchemy.orm import Session
import models
import schemas
from database import Base, engine, get_db

VEHICULOS_URL = os.getenv("VEHICULOS_URL", "http://servicio-vehiculos:8001")

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Servicio Operaciones")

_operaciones: dict[str, schemas.OperacionAlquiler] = {}


@app.post("/api/operaciones/alquiler", response_model=schemas.OperacionAlquiler)
async def alquilar(peticion: schemas.PeticionAlquiler):
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

    operacion = schemas.OperacionAlquiler(
        idOperacion=str(uuid.uuid4()),
        idVehiculo=peticion.idVehiculo,
        estado=schemas.EstadoOperacion.CONFIRMADA,
    )
    _operaciones[operacion.idOperacion] = operacion
    return operacion


@app.post("/api/operaciones/{id_operacion}/cancelar", response_model=schemas.OperacionAlquiler)
async def cancelar(id_operacion: str):
    operacion = _operaciones.get(id_operacion)
    if not operacion:
        raise HTTPException(status_code=404, detail="Operación no encontrada")

    async with httpx.AsyncClient() as client:
        patch = await client.patch(
            f"{VEHICULOS_URL}/api/vehiculos/{operacion.idVehiculo}/estado",
            json={"estado": "DISPONIBLE"},
        )
        if not patch.is_success:
            raise HTTPException(status_code=502, detail="Error al restaurar estado del vehículo")

    operacion.estado = schemas.EstadoOperacion.CANCELADA
    return operacion


@app.get("/api/operaciones", response_model=list[schemas.OperacionAlquiler])
def listar():
    return list(_operaciones.values())


@app.get("/api/contratos", response_model=list[schemas.ContratoResponse])
def listar_contratos(db: Session = Depends(get_db)):
    return db.query(models.Contrato).all()


@app.post("/api/contratos", response_model=schemas.ContratoResponse, status_code=201)
def crear_contrato(contrato: schemas.ContratoCreate, db: Session = Depends(get_db)):
    db_contrato = models.Contrato(
        **contrato.model_dump(),
        estado=models.EstadoContrato.PENDIENTE
    )
    db.add(db_contrato)
    db.commit()
    db.refresh(db_contrato)
    return db_contrato


@app.get("/api/contratos/{id}", response_model=schemas.ContratoResponse)
def obtener_contrato(id: int, db: Session = Depends(get_db)):
    contrato = db.query(models.Contrato).filter(models.Contrato.id == id).first()
    if not contrato:
        raise HTTPException(status_code=404, detail="Contrato no encontrado")
    return contrato


@app.put("/api/contratos/{id}", response_model=schemas.ContratoResponse)
def actualizar_contrato(id: int, contrato: schemas.ContratoCreate, db: Session = Depends(get_db)):
    db_contrato = db.query(models.Contrato).filter(models.Contrato.id == id).first()
    if not db_contrato:
        raise HTTPException(status_code=404, detail="Contrato no encontrado")
    for key, value in contrato.model_dump().items():
        setattr(db_contrato, key, value)
    db.commit()
    db.refresh(db_contrato)
    return db_contrato


@app.delete("/api/contratos/{id}", status_code=204)
def eliminar_contrato(id: int, db: Session = Depends(get_db)):
    db_contrato = db.query(models.Contrato).filter(models.Contrato.id == id).first()
    if not db_contrato:
        raise HTTPException(status_code=404, detail="Contrato no encontrado")
    db.delete(db_contrato)
    db.commit()


@app.get("/api/reservas", response_model=list[schemas.ReservaResponse])
def listar_reservas(db: Session = Depends(get_db)):
    return db.query(models.Reserva).all()


@app.post("/api/reservas", response_model=schemas.ReservaResponse, status_code=201)
def crear_reserva(reserva: schemas.ReservaCreate, db: Session = Depends(get_db)):
    db_reserva = models.Reserva(
        **reserva.model_dump(),
        estado=models.EstadoReserva.PENDIENTE
    )
    db.add(db_reserva)
    db.commit()
    db.refresh(db_reserva)
    return db_reserva


@app.post("/api/reservas/{id}/confirmar", response_model=schemas.ContratoResponse)
async def confirmar_reserva(
    id: int,
    body: schemas.ConfirmarReservaRequest,
    db: Session = Depends(get_db)
):
    reserva = db.query(models.Reserva).filter(models.Reserva.id == id).first()
    if not reserva:
        raise HTTPException(status_code=404, detail="Reserva no encontrada")
    
    if reserva.estado != models.EstadoReserva.PENDIENTE:
        raise HTTPException(status_code=409, detail="Reserva no está en estado PENDIENTE")
    
    async with httpx.AsyncClient() as client:
        patch = await client.patch(
            f"{VEHICULOS_URL}/api/vehiculos/{reserva.idVehiculo}/estado",
            json={"estado": "NO_DISPONIBLE"},
        )
        if not patch.is_success:
            raise HTTPException(status_code=502, detail="Error al actualizar estado del vehículo")
    
    reserva.estado = models.EstadoReserva.CONFIRMADA
    db.commit()
    
    contrato = models.Contrato(
        idCliente=reserva.idCliente,
        nombreCliente=reserva.nombreCliente,
        idVehiculo=reserva.idVehiculo,
        placa=reserva.placa,
        fechaInicio=reserva.fechaInicio,
        fechaFin=body.fechaFin,
        valorDiario=body.valorDiario,
        estado=models.EstadoContrato.ACTIVO,
    )
    db.add(contrato)
    db.commit()
    db.refresh(contrato)
    return contrato


@app.post("/api/reservas/{id}/cancelar", response_model=schemas.ReservaResponse)
def cancelar_reserva(id: int, db: Session = Depends(get_db)):
    reserva = db.query(models.Reserva).filter(models.Reserva.id == id).first()
    if not reserva:
        raise HTTPException(status_code=404, detail="Reserva no encontrada")
    
    reserva.estado = models.EstadoReserva.CANCELADA
    db.commit()
    db.refresh(reserva)
    return reserva


@app.delete("/api/reservas/{id}", status_code=204)
def eliminar_reserva(id: int, db: Session = Depends(get_db)):
    reserva = db.query(models.Reserva).filter(models.Reserva.id == id).first()
    if not reserva:
        raise HTTPException(status_code=404, detail="Reserva no encontrada")
    db.delete(reserva)
    db.commit()


@app.get("/api/devoluciones", response_model=list[schemas.DevolucionResponse])
def listar_devoluciones(db: Session = Depends(get_db)):
    return db.query(models.Devolucion).all()


@app.post("/api/devoluciones", response_model=schemas.DevolucionResponse, status_code=201)
async def registrar_devolucion(
    body: schemas.DevolucionCreate,
    db: Session = Depends(get_db)
):
    contrato = db.query(models.Contrato).filter(models.Contrato.id == body.idContrato).first()
    if not contrato:
        raise HTTPException(status_code=404, detail="Contrato no encontrado")
    
    async with httpx.AsyncClient() as client:
        patch = await client.patch(
            f"{VEHICULOS_URL}/api/vehiculos/{contrato.idVehiculo}/estado",
            json={"estado": "DISPONIBLE"},
        )
        if not patch.is_success:
            raise HTTPException(status_code=502, detail="Error al actualizar estado del vehículo")
    
    contrato.estado = models.EstadoContrato.COMPLETADO
    db.commit()
    
    devolucion = models.Devolucion(
        idContrato=body.idContrato,
        placa=contrato.placa,
        fechaDevolucion=date.today(),
        kmDevolucion=body.kmDevolucion,
        estado=models.EstadoDevolucion.COMPLETADO,
    )
    db.add(devolucion)
    db.commit()
    db.refresh(devolucion)
    return devolucion
