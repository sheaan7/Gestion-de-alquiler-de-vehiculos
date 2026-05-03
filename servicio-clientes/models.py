from sqlalchemy import Boolean, Column, Integer, String
from database import Base


class Cliente(Base):
    __tablename__ = "clientes"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    nombre = Column(String(120), nullable=False)
    # Python attribute name matches Pydantic schema; DB column name kept as snake_case
    cedulaNit = Column("cedula_nit", String(50), nullable=False, unique=True, index=True)
    telefono = Column(String(30), nullable=False)
    email = Column(String(120), nullable=False, unique=True, index=True)
    direccion = Column(String(200), nullable=False, default="")
    licencia = Column(String(20), nullable=False, default="")
    tipoCliente = Column("tipo_cliente", String(50), nullable=False, default="Particular")
    activo = Column(Boolean, nullable=False, default=True)
