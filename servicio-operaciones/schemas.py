from enum import Enum
from datetime import date
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


class EstadoContrato(str, Enum):
    PENDIENTE = "PENDIENTE"
    ACTIVO = "ACTIVO"
    COMPLETADO = "COMPLETADO"
    VENCIDO = "VENCIDO"


class ContratoBase(BaseModel):
    idCliente: int
    nombreCliente: str
    idVehiculo: int
    placa: str
    fechaInicio: date
    fechaFin: date
    valorDiario: int
    estado: EstadoContrato = EstadoContrato.PENDIENTE


class ContratoCreate(BaseModel):
    idCliente: int
    nombreCliente: str
    idVehiculo: int
    placa: str
    fechaInicio: date
    fechaFin: date
    valorDiario: int


class ContratoResponse(ContratoBase):
    id: int

    model_config = {"from_attributes": True}


class EstadoReserva(str, Enum):
    PENDIENTE = "PENDIENTE"
    CONFIRMADA = "CONFIRMADA"
    CANCELADA = "CANCELADA"


class ReservaBase(BaseModel):
    idCliente: int
    nombreCliente: str
    idVehiculo: int
    placa: str
    fechaReserva: date
    fechaInicio: date
    estado: EstadoReserva = EstadoReserva.PENDIENTE


class ReservaCreate(BaseModel):
    idCliente: int
    nombreCliente: str
    idVehiculo: int
    placa: str
    fechaReserva: date
    fechaInicio: date


class ReservaResponse(ReservaBase):
    id: int

    model_config = {"from_attributes": True}


class ConfirmarReservaRequest(BaseModel):
    fechaFin: date
    valorDiario: int


class EstadoDevolucion(str, Enum):
    PENDIENTE = "PENDIENTE"
    COMPLETADO = "COMPLETADO"


class DevolucionBase(BaseModel):
    idContrato: int
    placa: str
    fechaDevolucion: date
    kmDevolucion: int
    estado: EstadoDevolucion = EstadoDevolucion.PENDIENTE


class DevolucionCreate(BaseModel):
    idContrato: int
    kmDevolucion: int


class DevolucionResponse(DevolucionBase):
    id: int

    model_config = {"from_attributes": True}
