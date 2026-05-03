from enum import Enum
from pydantic import BaseModel


class EstadoVehiculo(str, Enum):
    DISPONIBLE = "DISPONIBLE"
    NO_DISPONIBLE = "NO_DISPONIBLE"


class VehiculoBase(BaseModel):
    marca: str
    modelo: str
    estado: EstadoVehiculo = EstadoVehiculo.DISPONIBLE


class VehiculoCreate(VehiculoBase):
    pass


class VehiculoResponse(VehiculoBase):
    id: int

    model_config = {"from_attributes": True}


class EstadoUpdate(BaseModel):
    estado: EstadoVehiculo
