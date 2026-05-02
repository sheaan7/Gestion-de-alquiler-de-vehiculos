package com.alquiler.operaciones.cliente;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(name = "servicio-vehiculos", path = "/api/vehiculos")
public interface ClienteVehiculos {
    @GetMapping("/{idVehiculo}")
    RespuestaVehiculo buscarPorId(@PathVariable Long idVehiculo);

    @PutMapping("/{idVehiculo}/estado")
    RespuestaVehiculo actualizarEstado(@PathVariable Long idVehiculo, @RequestBody PeticionEstado peticionEstado);

    record RespuestaVehiculo(Long id, String marca, String modelo, String estado) {
    }

    record PeticionEstado(String estado) {
    }
}
