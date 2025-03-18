import { useState } from "react";
import VehiculoDatos from "../types/VehiculosType";

// Estado para controlar si el modal está abierto o cerrado
export const [isModalOpen, setIsModalOpen] = useState(false);

// Estado para almacenar la lista de vehículos
export const [vehiculos, setVehiculos] = useState<VehiculoDatos[]>([]);

// Estado para manejar carga y errores
export const [loading, setLoading] = useState(false);
export const [error, setError] = useState<string | null>(null);

// Función para cargar los vehículos desde la API
