package com.alquiler.eureka;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.netflix.eureka.server.EnableEurekaServer;

@SpringBootApplication
@EnableEurekaServer
public class AplicacionEureka {
    public static void main(String[] argumentos) {
        SpringApplication.run(AplicacionEureka.class, argumentos);
    }
}
