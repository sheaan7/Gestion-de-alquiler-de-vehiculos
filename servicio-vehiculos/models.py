import enum
from sqlalchemy import Column, Integer, String, Enum
from database import Base


class EstadoVehiculo(str, enum.Enum):
    DISPONIBLE = "DISPONIBLE"
    NO_DISPONIBLE = "NO_DISPONIBLE"


class Vehiculo(Base):
    __tablename__ = "vehiculos"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    placa = Column(String(20), nullable=False, unique=True)
    marca = Column(String(100), nullable=False)
    modelo = Column(String(100), nullable=False)
    anio = Column(Integer, nullable=False)
    tipo = Column(String(50), nullable=False)
    km_actuales = Column(Integer, nullable=False, default=0)
    estado = Column(
        Enum(EstadoVehiculo),
        nullable=False,
        default=EstadoVehiculo.DISPONIBLE,
    )
