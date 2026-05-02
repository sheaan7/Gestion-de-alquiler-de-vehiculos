package com.alquiler.operaciones.servicio;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.alquiler.operaciones.cliente.ClienteVehiculos;
import com.alquiler.operaciones.modelo.EstadoOperacion;
import com.alquiler.operaciones.modelo.OperacionAlquiler;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class ServicioOperacionesTest {
    @Mock
    private ClienteVehiculos clienteVehiculos;
    @InjectMocks
    private ServicioOperaciones servicioOperaciones;

    @Test
    void alquilarVehiculoDisponible() {
        when(clienteVehiculos.buscarPorId(1L))
                .thenReturn(new ClienteVehiculos.RespuestaVehiculo(1L, "Toyota", "Corolla", "DISPONIBLE"));
        when(clienteVehiculos.actualizarEstado(eq(1L), any()))
                .thenReturn(new ClienteVehiculos.RespuestaVehiculo(1L, "Toyota", "Corolla", "NO_DISPONIBLE"));

        OperacionAlquiler operacion = servicioOperaciones.alquilar(1L);

        assertEquals(EstadoOperacion.CONFIRMADA, operacion.getEstado());
        verify(clienteVehiculos).actualizarEstado(eq(1L), any());
    }
}
