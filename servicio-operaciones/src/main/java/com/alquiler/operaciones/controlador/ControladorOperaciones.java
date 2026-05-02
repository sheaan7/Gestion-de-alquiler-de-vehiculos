package com.alquiler.operaciones.controlador;

import com.alquiler.operaciones.modelo.OperacionAlquiler;
import com.alquiler.operaciones.servicio.ServicioOperaciones;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/operaciones")
public class ControladorOperaciones {
    private final ServicioOperaciones servicioOperaciones;

    public ControladorOperaciones(ServicioOperaciones servicioOperaciones) {
        this.servicioOperaciones = servicioOperaciones;
    }

    @PostMapping("/alquiler")
    public OperacionAlquiler alquilar(@RequestBody PeticionAlquiler peticionAlquiler) {
        return servicioOperaciones.alquilar(peticionAlquiler.idVehiculo());
    }

    @PostMapping("/{idOperacion}/cancelar")
    public OperacionAlquiler cancelar(@PathVariable String idOperacion) {
        return servicioOperaciones.cancelar(idOperacion);
    }

    @GetMapping
    public List<OperacionAlquiler> listar() {
        return servicioOperaciones.listar();
    }

    public record PeticionAlquiler(Long idVehiculo) {
    }
}
