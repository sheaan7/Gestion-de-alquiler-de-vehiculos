package com.alquiler.operaciones.servicio;

import com.alquiler.operaciones.cliente.ClienteVehiculos;
import com.alquiler.operaciones.modelo.EstadoOperacion;
import com.alquiler.operaciones.modelo.OperacionAlquiler;
import feign.FeignException;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class ServicioOperaciones {
    private final ClienteVehiculos clienteVehiculos;
    private final Map<String, OperacionAlquiler> operaciones = new ConcurrentHashMap<>();

    public ServicioOperaciones(ClienteVehiculos clienteVehiculos) {
        this.clienteVehiculos = clienteVehiculos;
    }

    public OperacionAlquiler alquilar(Long idVehiculo) {
        ClienteVehiculos.RespuestaVehiculo vehiculo;
        try {
            vehiculo = clienteVehiculos.buscarPorId(idVehiculo);
        } catch (FeignException.NotFound ex) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Vehiculo no encontrado");
        }
        if (!"DISPONIBLE".equals(vehiculo.estado())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Vehiculo no disponible");
        }
        clienteVehiculos.actualizarEstado(idVehiculo, new ClienteVehiculos.PeticionEstado("NO_DISPONIBLE"));
        OperacionAlquiler operacion = new OperacionAlquiler(UUID.randomUUID().toString(), idVehiculo, EstadoOperacion.CONFIRMADA);
        operaciones.put(operacion.getIdOperacion(), operacion);
        return operacion;
    }

    public OperacionAlquiler cancelar(String idOperacion) {
        OperacionAlquiler operacion = operaciones.get(idOperacion);
        if (operacion == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Operacion no encontrada");
        }
        clienteVehiculos.actualizarEstado(operacion.getIdVehiculo(), new ClienteVehiculos.PeticionEstado("DISPONIBLE"));
        operacion.setEstado(EstadoOperacion.CANCELADA);
        return operacion;
    }

    public List<OperacionAlquiler> listar() {
        return operaciones.values().stream().toList();
    }
}
