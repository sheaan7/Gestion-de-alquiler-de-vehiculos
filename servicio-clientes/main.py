from fastapi import FastAPI, Depends, HTTPException, Query
from sqlalchemy.orm import Session
import models
import schemas
from database import Base, engine, get_db

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Servicio Clientes")


@app.get("/api/clientes/buscar", response_model=list[schemas.ClienteResponse])
def buscar(q: str = Query(...), db: Session = Depends(get_db)):
    return db.query(models.Cliente).filter(
        models.Cliente.nombre.ilike(f"%{q}%")
        | models.Cliente.cedulaNit.ilike(f"%{q}%")
        | models.Cliente.email.ilike(f"%{q}%")
    ).all()


@app.get("/api/clientes", response_model=list[schemas.ClienteResponse])
def listar(db: Session = Depends(get_db)):
    return db.query(models.Cliente).all()


@app.get("/api/clientes/{id}", response_model=schemas.ClienteResponse)
def obtener(id: int, db: Session = Depends(get_db)):
    cliente = db.query(models.Cliente).filter(models.Cliente.id == id).first()
    if not cliente:
        raise HTTPException(status_code=404, detail="Cliente no encontrado")
    return cliente


@app.post("/api/clientes", response_model=schemas.ClienteResponse, status_code=201)
def crear(cliente: schemas.ClienteCreate, db: Session = Depends(get_db)):
    db_cliente = models.Cliente(**cliente.model_dump())
    db.add(db_cliente)
    db.commit()
    db.refresh(db_cliente)
    return db_cliente


@app.put("/api/clientes/{id}", response_model=schemas.ClienteResponse)
def actualizar(id: int, cliente: schemas.ClienteCreate, db: Session = Depends(get_db)):
    db_cliente = db.query(models.Cliente).filter(models.Cliente.id == id).first()
    if not db_cliente:
        raise HTTPException(status_code=404, detail="Cliente no encontrado")
    for key, value in cliente.model_dump().items():
        setattr(db_cliente, key, value)
    db.commit()
    db.refresh(db_cliente)
    return db_cliente


@app.delete("/api/clientes/{id}", status_code=204)
def eliminar(id: int, db: Session = Depends(get_db)):
    db_cliente = db.query(models.Cliente).filter(models.Cliente.id == id).first()
    if not db_cliente:
        raise HTTPException(status_code=404, detail="Cliente no encontrado")
    db.delete(db_cliente)
    db.commit()
