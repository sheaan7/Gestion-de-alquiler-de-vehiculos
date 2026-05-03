import enum
from sqlalchemy import Column, Integer, String, Date, Enum
from database import Base


class EstadoContrato(str, enum.Enum):
    PENDIENTE = "PENDIENTE"
    ACTIVO = "ACTIVO"
    COMPLETADO = "COMPLETADO"
    VENCIDO = "VENCIDO"


class EstadoReserva(str, enum.Enum):
    PENDIENTE = "PENDIENTE"
    CONFIRMADA = "CONFIRMADA"
    CANCELADA = "CANCELADA"


class EstadoDevolucion(str, enum.Enum):
    PENDIENTE = "PENDIENTE"
    COMPLETADO = "COMPLETADO"


class Contrato(Base):
    __tablename__ = "contratos"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    idCliente = Column(Integer, nullable=False)
    nombreCliente = Column(String(120), nullable=False)
    idVehiculo = Column(Integer, nullable=False)
    placa = Column(String(20), nullable=False)
    fechaInicio = Column(Date, nullable=False)
    fechaFin = Column(Date, nullable=False)
    valorDiario = Column(Integer, nullable=False)
    estado = Column(
        Enum(EstadoContrato),
        nullable=False,
        default=EstadoContrato.PENDIENTE,
    )


class Reserva(Base):
    __tablename__ = "reservas"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    idCliente = Column(Integer, nullable=False)
    nombreCliente = Column(String(120), nullable=False)
    idVehiculo = Column(Integer, nullable=False)
    placa = Column(String(20), nullable=False)
    fechaReserva = Column(Date, nullable=False)
    fechaInicio = Column(Date, nullable=False)
    estado = Column(
        Enum(EstadoReserva),
        nullable=False,
        default=EstadoReserva.PENDIENTE,
    )


class Devolucion(Base):
    __tablename__ = "devoluciones"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    idContrato = Column(Integer, nullable=False)
    placa = Column(String(20), nullable=False)
    fechaDevolucion = Column(Date, nullable=False)
    kmDevolucion = Column(Integer, nullable=False)
    estado = Column(
        Enum(EstadoDevolucion),
        nullable=False,
        default=EstadoDevolucion.PENDIENTE,
    )
