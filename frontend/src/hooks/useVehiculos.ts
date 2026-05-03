import { useCallback, useEffect, useState } from "react";
import { listarVehiculos } from "../lib/clienteApi";
import { Vehiculo } from "../types/vehiculo";

export function useVehiculos() {
  const [vehiculos, setVehiculos] = useState<Vehiculo[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const cargar = useCallback(async () => {
    setCargando(true);
    setError(null);
    try {
      setVehiculos(await listarVehiculos());
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al cargar vehículos");
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    void cargar();
  }, [cargar]);

  return { vehiculos, cargando, error, recargar: cargar };
}
