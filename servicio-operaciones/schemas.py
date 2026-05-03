from enum import Enum
from pydantic import BaseModel


class EstadoOperacion(str, Enum):
    CONFIRMADA = "CONFIRMADA"
    CANCELADA = "CANCELADA"


class OperacionAlquiler(BaseModel):
    idOperacion: str
    idVehiculo: int
    estado: EstadoOperacion


class PeticionAlquiler(BaseModel):
    idVehiculo: int
