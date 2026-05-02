package com.alquiler.operaciones.cliente;

import static org.junit.jupiter.api.Assertions.assertTrue;

import java.lang.reflect.Method;
import org.junit.jupiter.api.Test;
import org.springframework.web.bind.annotation.PutMapping;

class ClienteVehiculosHttpMethodTest {

    @Test
    void actualizarEstadoDebeUsarPutMapping() throws NoSuchMethodException {
        Method metodo = ClienteVehiculos.class.getDeclaredMethod(
                "actualizarEstado",
                Long.class,
                ClienteVehiculos.PeticionEstado.class
        );

        assertTrue(
                metodo.isAnnotationPresent(PutMapping.class),
                "actualizarEstado debe usar PUT para evitar fallos de PATCH en cliente Feign por defecto"
        );
    }
}
