package com.alquiler.vehiculos.repositorio;

import com.alquiler.vehiculos.modelo.EstadoVehiculo;
import com.alquiler.vehiculos.modelo.Vehiculo;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RepositorioVehiculo extends JpaRepository<Vehiculo, Long> {
    List<Vehiculo> findByMarcaContainingIgnoreCase(String marca);
    List<Vehiculo> findByModeloContainingIgnoreCase(String modelo);
    List<Vehiculo> findByEstado(EstadoVehiculo estado);
}
