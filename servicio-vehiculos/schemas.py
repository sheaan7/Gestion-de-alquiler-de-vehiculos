from enum import Enum
from typing import Literal, Optional
from datetime import date
from pydantic import BaseModel


class EstadoVehiculo(str, Enum):
    DISPONIBLE = "DISPONIBLE"
    NO_DISPONIBLE = "NO_DISPONIBLE"


TipoVehiculo = Literal["SUV", "Sedán", "Camioneta", "Van", "Compacto", "Lujo"]


class VehiculoBase(BaseModel):
    placa: str
    marca: str
    modelo: str
    anio: int
    tipo: TipoVehiculo
    km_actuales: int = 0
    estado: EstadoVehiculo = EstadoVehiculo.DISPONIBLE


class VehiculoCreate(VehiculoBase):
    pass


class VehiculoResponse(VehiculoBase):
    id: int

    model_config = {"from_attributes": True}


class EstadoUpdate(BaseModel):
    estado: EstadoVehiculo


class EstadoMantenimiento(str, Enum):
    PROGRAMADO = "PROGRAMADO"
    EN_PROCESO = "EN_PROCESO"
    COMPLETADO = "COMPLETADO"


class MantenimientoBase(BaseModel):
    idVehiculo: int
    placa: str
    tipo: str
    descripcion: str
    fechaProgramada: date
    estado: EstadoMantenimiento = EstadoMantenimiento.PROGRAMADO


class MantenimientoCreate(BaseModel):
    idVehiculo: int
    placa: str
    tipo: str
    descripcion: str
    fechaProgramada: date


class MantenimientoResponse(MantenimientoBase):
    id: int

    model_config = {"from_attributes": True}
