package com.alquiler.vehiculos.repositorio;

import static org.junit.jupiter.api.Assertions.assertFalse;

import com.alquiler.vehiculos.modelo.EstadoVehiculo;
import com.alquiler.vehiculos.modelo.Vehiculo;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

@DataJpaTest
class RepositorioVehiculoTest {
    @Autowired
    private RepositorioVehiculo repositorioVehiculo;

    @Test
    void buscaPorEstadoDisponible() {
        Vehiculo vehiculo = new Vehiculo();
        vehiculo.setMarca("Mazda");
        vehiculo.setModelo("CX5");
        vehiculo.setEstado(EstadoVehiculo.DISPONIBLE);
        repositorioVehiculo.save(vehiculo);
        List<Vehiculo> resultados = repositorioVehiculo.findByEstado(EstadoVehiculo.DISPONIBLE);
        assertFalse(resultados.isEmpty());
    }
}
