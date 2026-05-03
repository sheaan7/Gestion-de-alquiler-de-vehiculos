from pydantic import BaseModel


class ClienteBase(BaseModel):
    nombre: str
    cedulaNit: str
    telefono: str
    email: str
    direccion: str = ""
    licencia: str = ""
    tipoCliente: str = "Particular"
    activo: bool = True


class ClienteCreate(ClienteBase):
    pass


class ClienteResponse(ClienteBase):
    id: int

    model_config = {"from_attributes": True}
