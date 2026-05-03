import enum
from sqlalchemy import Column, Integer, String, Enum
from database import Base


class EstadoVehiculo(str, enum.Enum):
    DISPONIBLE = "DISPONIBLE"
    NO_DISPONIBLE = "NO_DISPONIBLE"


class Vehiculo(Base):
    __tablename__ = "vehiculos"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    marca = Column(String(100), nullable=False)
    modelo = Column(String(100), nullable=False)
    estado = Column(
        Enum(EstadoVehiculo),
        nullable=False,
        default=EstadoVehiculo.DISPONIBLE,
    )
