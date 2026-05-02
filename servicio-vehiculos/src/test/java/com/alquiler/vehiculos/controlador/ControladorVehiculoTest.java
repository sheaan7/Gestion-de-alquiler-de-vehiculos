package com.alquiler.vehiculos.controlador;

import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.alquiler.vehiculos.modelo.EstadoVehiculo;
import com.alquiler.vehiculos.modelo.Vehiculo;
import com.alquiler.vehiculos.servicio.ServicioVehiculo;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;

@WebMvcTest(ControladorVehiculo.class)
class ControladorVehiculoTest {
    @Autowired
    private MockMvc clienteMvc;

    @MockBean
    private ServicioVehiculo servicioVehiculo;

    @Test
    void listarVehiculosResponde200() throws Exception {
        Vehiculo vehiculo = new Vehiculo();
        vehiculo.setId(1L);
        vehiculo.setMarca("Toyota");
        vehiculo.setModelo("Corolla");
        vehiculo.setEstado(EstadoVehiculo.DISPONIBLE);
        when(servicioVehiculo.listar()).thenReturn(List.of(vehiculo));
        clienteMvc.perform(get("/api/vehiculos"))
                .andExpect(status().isOk());
    }

    @Test
    void actualizarEstadoConPutResponde200() throws Exception {
        Vehiculo vehiculo = new Vehiculo();
        vehiculo.setId(1L);
        vehiculo.setMarca("Toyota");
        vehiculo.setModelo("Corolla");
        vehiculo.setEstado(EstadoVehiculo.NO_DISPONIBLE);
        when(servicioVehiculo.actualizarEstado(1L, EstadoVehiculo.NO_DISPONIBLE)).thenReturn(vehiculo);

        clienteMvc.perform(
                        put("/api/vehiculos/1/estado")
                                .contentType("application/json")
                                .content("{\"estado\":\"NO_DISPONIBLE\"}")
                )
                .andExpect(status().isOk());

        verify(servicioVehiculo).actualizarEstado(eq(1L), eq(EstadoVehiculo.NO_DISPONIBLE));
    }
}
