from typing import Optional
from fastapi import FastAPI, Depends, HTTPException, Query
from sqlalchemy.orm import Session
import models
import schemas
from database import Base, engine, get_db

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Servicio Vehículos")


@app.get("/api/vehiculos/buscar", response_model=list[schemas.VehiculoResponse])
def buscar(
    marca: Optional[str] = Query(None),
    modelo: Optional[str] = Query(None),
    estado: Optional[schemas.EstadoVehiculo] = Query(None),
    placa: Optional[str] = Query(None),
    tipo: Optional[str] = Query(None),
    db: Session = Depends(get_db),
):
    query = db.query(models.Vehiculo)
    if marca:
        query = query.filter(models.Vehiculo.marca.ilike(f"%{marca}%"))
    if modelo:
        query = query.filter(models.Vehiculo.modelo.ilike(f"%{modelo}%"))
    if estado:
        query = query.filter(models.Vehiculo.estado == estado)
    if placa:
        query = query.filter(models.Vehiculo.placa.ilike(f"%{placa}%"))
    if tipo:
        query = query.filter(models.Vehiculo.tipo == tipo)
    return query.all()


@app.get("/api/vehiculos", response_model=list[schemas.VehiculoResponse])
def listar(db: Session = Depends(get_db)):
    return db.query(models.Vehiculo).all()


@app.get("/api/vehiculos/{id}", response_model=schemas.VehiculoResponse)
def obtener(id: int, db: Session = Depends(get_db)):
    vehiculo = db.query(models.Vehiculo).filter(models.Vehiculo.id == id).first()
    if not vehiculo:
        raise HTTPException(status_code=404, detail="Vehículo no encontrado")
    return vehiculo


@app.post("/api/vehiculos", response_model=schemas.VehiculoResponse, status_code=201)
def crear(vehiculo: schemas.VehiculoCreate, db: Session = Depends(get_db)):
    db_vehiculo = models.Vehiculo(**vehiculo.model_dump())
    db.add(db_vehiculo)
    db.commit()
    db.refresh(db_vehiculo)
    return db_vehiculo


@app.put("/api/vehiculos/{id}", response_model=schemas.VehiculoResponse)
def actualizar(id: int, vehiculo: schemas.VehiculoCreate, db: Session = Depends(get_db)):
    db_vehiculo = db.query(models.Vehiculo).filter(models.Vehiculo.id == id).first()
    if not db_vehiculo:
        raise HTTPException(status_code=404, detail="Vehículo no encontrado")
    for key, value in vehiculo.model_dump().items():
        setattr(db_vehiculo, key, value)
    db.commit()
    db.refresh(db_vehiculo)
    return db_vehiculo


@app.delete("/api/vehiculos/{id}", status_code=204)
def eliminar(id: int, db: Session = Depends(get_db)):
    db_vehiculo = db.query(models.Vehiculo).filter(models.Vehiculo.id == id).first()
    if not db_vehiculo:
        raise HTTPException(status_code=404, detail="Vehículo no encontrado")
    db.delete(db_vehiculo)
    db.commit()


@app.patch("/api/vehiculos/{id}/estado", response_model=schemas.VehiculoResponse)
def actualizar_estado_patch(id: int, body: schemas.EstadoUpdate, db: Session = Depends(get_db)):
    return _cambiar_estado(id, body, db)


@app.put("/api/vehiculos/{id}/estado", response_model=schemas.VehiculoResponse)
def actualizar_estado_put(id: int, body: schemas.EstadoUpdate, db: Session = Depends(get_db)):
    return _cambiar_estado(id, body, db)


def _cambiar_estado(id: int, body: schemas.EstadoUpdate, db: Session):
    db_vehiculo = db.query(models.Vehiculo).filter(models.Vehiculo.id == id).first()
    if not db_vehiculo:
        raise HTTPException(status_code=404, detail="Vehículo no encontrado")
    db_vehiculo.estado = body.estado
    db.commit()
    db.refresh(db_vehiculo)
    return db_vehiculo


@app.get("/api/mantenimientos", response_model=list[schemas.MantenimientoResponse])
def listar_mantenimientos(db: Session = Depends(get_db)):
    return db.query(models.Mantenimiento).all()


@app.post("/api/mantenimientos", response_model=schemas.MantenimientoResponse, status_code=201)
def crear_mantenimiento(mantenimiento: schemas.MantenimientoCreate, db: Session = Depends(get_db)):
    db_mantenimiento = models.Mantenimiento(
        **mantenimiento.model_dump(),
        estado=models.EstadoMantenimiento.PROGRAMADO
    )
    db.add(db_mantenimiento)
    db.commit()
    db.refresh(db_mantenimiento)
    return db_mantenimiento


@app.put("/api/mantenimientos/{id}", response_model=schemas.MantenimientoResponse)
def actualizar_mantenimiento(id: int, mantenimiento: schemas.MantenimientoCreate, db: Session = Depends(get_db)):
    db_mantenimiento = db.query(models.Mantenimiento).filter(models.Mantenimiento.id == id).first()
    if not db_mantenimiento:
        raise HTTPException(status_code=404, detail="Mantenimiento no encontrado")
    for key, value in mantenimiento.model_dump().items():
        setattr(db_mantenimiento, key, value)
    db.commit()
    db.refresh(db_mantenimiento)
    return db_mantenimiento


@app.post("/api/mantenimientos/{id}/completar", response_model=schemas.MantenimientoResponse)
def completar_mantenimiento(id: int, db: Session = Depends(get_db)):
    db_mantenimiento = db.query(models.Mantenimiento).filter(models.Mantenimiento.id == id).first()
    if not db_mantenimiento:
        raise HTTPException(status_code=404, detail="Mantenimiento no encontrado")
    db_mantenimiento.estado = models.EstadoMantenimiento.COMPLETADO
    db.commit()
    db.refresh(db_mantenimiento)
    return db_mantenimiento


@app.delete("/api/mantenimientos/{id}", status_code=204)
def eliminar_mantenimiento(id: int, db: Session = Depends(get_db)):
    db_mantenimiento = db.query(models.Mantenimiento).filter(models.Mantenimiento.id == id).first()
    if not db_mantenimiento:
        raise HTTPException(status_code=404, detail="Mantenimiento no encontrado")
    db.delete(db_mantenimiento)
    db.commit()
