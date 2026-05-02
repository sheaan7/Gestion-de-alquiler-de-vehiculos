package com.alquiler.vehiculos;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@SpringBootApplication
@EnableDiscoveryClient
public class AplicacionVehiculos {
    public static void main(String[] argumentos) {
        SpringApplication.run(AplicacionVehiculos.class, argumentos);
    }
}
