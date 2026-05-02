package com.alquiler.operaciones.modelo;

public class OperacionAlquiler {
    private String idOperacion;
    private Long idVehiculo;
    private EstadoOperacion estado;

    public OperacionAlquiler(String idOperacion, Long idVehiculo, EstadoOperacion estado) {
        this.idOperacion = idOperacion;
        this.idVehiculo = idVehiculo;
        this.estado = estado;
    }

    public String getIdOperacion() {
        return idOperacion;
    }

    public Long getIdVehiculo() {
        return idVehiculo;
    }

    public EstadoOperacion getEstado() {
        return estado;
    }

    public void setEstado(EstadoOperacion estado) {
        this.estado = estado;
    }
}
