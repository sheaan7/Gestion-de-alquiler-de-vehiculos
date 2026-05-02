package com.alquiler.operaciones;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication
@EnableDiscoveryClient
@EnableFeignClients
public class AplicacionOperaciones {
    public static void main(String[] argumentos) {
        SpringApplication.run(AplicacionOperaciones.class, argumentos);
    }
}
