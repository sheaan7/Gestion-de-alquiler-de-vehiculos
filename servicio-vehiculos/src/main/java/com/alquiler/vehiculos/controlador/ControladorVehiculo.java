package com.alquiler.vehiculos.controlador;

import com.alquiler.vehiculos.modelo.EstadoVehiculo;
import com.alquiler.vehiculos.modelo.Vehiculo;
import com.alquiler.vehiculos.servicio.ServicioVehiculo;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/vehiculos")
public class ControladorVehiculo {
    private final ServicioVehiculo servicioVehiculo;

    public ControladorVehiculo(ServicioVehiculo servicioVehiculo) {
        this.servicioVehiculo = servicioVehiculo;
    }

    @GetMapping
    public List<Vehiculo> listar() {
        return servicioVehiculo.listar();
    }

    @GetMapping("/{idVehiculo}")
    public Vehiculo buscarPorId(@PathVariable Long idVehiculo) {
        return servicioVehiculo.buscarPorId(idVehiculo);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Vehiculo crear(@RequestBody Vehiculo vehiculo) {
        return servicioVehiculo.crear(vehiculo);
    }

    @PutMapping("/{idVehiculo}")
    public Vehiculo actualizar(@PathVariable Long idVehiculo, @RequestBody Vehiculo vehiculo) {
        return servicioVehiculo.actualizar(idVehiculo, vehiculo);
    }

    @DeleteMapping("/{idVehiculo}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void eliminar(@PathVariable Long idVehiculo) {
        servicioVehiculo.eliminar(idVehiculo);
    }

    @GetMapping("/buscar")
    public List<Vehiculo> buscar(
            @RequestParam(required = false) String marca,
            @RequestParam(required = false) String modelo,
            @RequestParam(required = false) EstadoVehiculo estado
    ) {
        return servicioVehiculo.buscar(marca, modelo, estado);
    }

    @PatchMapping("/{idVehiculo}/estado")
    public Vehiculo actualizarEstado(@PathVariable Long idVehiculo, @RequestBody PeticionEstado peticionEstado) {
        return servicioVehiculo.actualizarEstado(idVehiculo, peticionEstado.estado());
    }

    public record PeticionEstado(EstadoVehiculo estado) {
    }
}
