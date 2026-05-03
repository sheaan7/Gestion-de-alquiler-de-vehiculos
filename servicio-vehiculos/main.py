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
    db: Session = Depends(get_db),
):
    query = db.query(models.Vehiculo)
    if marca:
        query = query.filter(models.Vehiculo.marca.ilike(f"%{marca}%"))
    if modelo:
        query = query.filter(models.Vehiculo.modelo.ilike(f"%{modelo}%"))
    if estado:
        query = query.filter(models.Vehiculo.estado == estado)
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
@app.put("/api/vehiculos/{id}/estado", response_model=schemas.VehiculoResponse)
def actualizar_estado(id: int, body: schemas.EstadoUpdate, db: Session = Depends(get_db)):
    db_vehiculo = db.query(models.Vehiculo).filter(models.Vehiculo.id == id).first()
    if not db_vehiculo:
        raise HTTPException(status_code=404, detail="Vehículo no encontrado")
    db_vehiculo.estado = body.estado
    db.commit()
    db.refresh(db_vehiculo)
    return db_vehiculo
