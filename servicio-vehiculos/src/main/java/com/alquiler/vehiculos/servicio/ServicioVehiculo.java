package com.alquiler.vehiculos.servicio;

import com.alquiler.vehiculos.modelo.EstadoVehiculo;
import com.alquiler.vehiculos.modelo.Vehiculo;
import com.alquiler.vehiculos.repositorio.RepositorioVehiculo;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class ServicioVehiculo {
    private final RepositorioVehiculo repositorioVehiculo;

    public ServicioVehiculo(RepositorioVehiculo repositorioVehiculo) {
        this.repositorioVehiculo = repositorioVehiculo;
    }

    public List<Vehiculo> listar() {
        return repositorioVehiculo.findAll();
    }

    public Vehiculo buscarPorId(Long idVehiculo) {
        return repositorioVehiculo.findById(idVehiculo)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Vehiculo no encontrado"));
    }

    public Vehiculo crear(Vehiculo vehiculo) {
        if (vehiculo.getEstado() == null) {
            vehiculo.setEstado(EstadoVehiculo.DISPONIBLE);
        }
        return repositorioVehiculo.save(vehiculo);
    }

    public Vehiculo actualizar(Long idVehiculo, Vehiculo vehiculo) {
        Vehiculo vehiculoActual = buscarPorId(idVehiculo);
        vehiculoActual.setMarca(vehiculo.getMarca());
        vehiculoActual.setModelo(vehiculo.getModelo());
        vehiculoActual.setEstado(vehiculo.getEstado());
        return repositorioVehiculo.save(vehiculoActual);
    }

    public void eliminar(Long idVehiculo) {
        Vehiculo vehiculo = buscarPorId(idVehiculo);
        repositorioVehiculo.delete(vehiculo);
    }

    public List<Vehiculo> buscar(String marca, String modelo, EstadoVehiculo estado) {
        if (marca != null && !marca.isBlank()) {
            return repositorioVehiculo.findByMarcaContainingIgnoreCase(marca);
        }
        if (modelo != null && !modelo.isBlank()) {
            return repositorioVehiculo.findByModeloContainingIgnoreCase(modelo);
        }
        if (estado != null) {
            return repositorioVehiculo.findByEstado(estado);
        }
        return listar();
    }

    public Vehiculo actualizarEstado(Long idVehiculo, EstadoVehiculo estado) {
        Vehiculo vehiculo = buscarPorId(idVehiculo);
        vehiculo.setEstado(estado);
        return repositorioVehiculo.save(vehiculo);
    }
}
