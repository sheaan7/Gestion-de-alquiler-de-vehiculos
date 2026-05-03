import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

import sys
import os

# Set DATABASE_URL to SQLite BEFORE importing main/database so that the
# module-level create_engine() and Base.metadata.create_all() in main.py
# use SQLite instead of attempting a MySQL connection.
DATABASE_URL_TEST = "sqlite:///./test_clientes.db"
os.environ["DATABASE_URL"] = DATABASE_URL_TEST

sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from database import Base, get_db
from main import app

engine_test = create_engine(DATABASE_URL_TEST, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine_test)


def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


@pytest.fixture(autouse=True)
def client():
    Base.metadata.create_all(bind=engine_test)
    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as c:
        yield c
    app.dependency_overrides.clear()
    Base.metadata.drop_all(bind=engine_test)


PAYLOAD_BASE = {
    "nombre": "María García",
    "cedulaNit": "52145789",
    "telefono": "3001112233",
    "email": "maria@gmail.com",
    "direccion": "Cll 80 #15-20",
    "licencia": "B1",
    "tipoCliente": "Particular",
    "activo": True,
}


def test_listar_clientes_devuelve_lista_vacia(client):
    resp = client.get("/api/clientes")
    assert resp.status_code == 200
    assert resp.json() == []


def test_crear_y_obtener_cliente(client):
    creado = client.post("/api/clientes", json=PAYLOAD_BASE)
    assert creado.status_code == 201
    cid = creado.json()["id"]
    obtenido = client.get(f"/api/clientes/{cid}")
    assert obtenido.status_code == 200
    assert obtenido.json()["nombre"] == "María García"


def test_actualizar_cliente(client):
    creado = client.post("/api/clientes", json=PAYLOAD_BASE)
    cid = creado.json()["id"]
    actualizado = client.put(f"/api/clientes/{cid}", json={**PAYLOAD_BASE, "nombre": "María López"})
    assert actualizado.status_code == 200
    assert actualizado.json()["nombre"] == "María López"


def test_eliminar_cliente(client):
    creado = client.post("/api/clientes", json=PAYLOAD_BASE)
    cid = creado.json()["id"]
    resp = client.delete(f"/api/clientes/{cid}")
    assert resp.status_code == 204
    assert client.get(f"/api/clientes/{cid}").status_code == 404


def test_buscar_cliente_por_nombre(client):
    client.post("/api/clientes", json=PAYLOAD_BASE)
    resp = client.get("/api/clientes/buscar?q=María")
    assert resp.status_code == 200
    assert len(resp.json()) == 1
    assert resp.json()[0]["nombre"] == "María García"


def test_obtener_cliente_inexistente_devuelve_404(client):
    resp = client.get("/api/clientes/999")
    assert resp.status_code == 404
