import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';
import { VehiculoDatos, VehiculoDatosTabla, Api } from "../types/VehiculosType";
import Swal from 'sweetalert2';

// Definir la estructura del contexto
interface VehiculoContextType {
  // Estado del formulario
  formData: VehiculoDatos;
  setFormData: React.Dispatch<React.SetStateAction<VehiculoDatos>>;
  isLoading: boolean;
  error: string | null;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  saveVehiculo: () => Promise<any>;
  resetForm: () => void;
  isEditing: boolean;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
  initializeForm: (vehiculoData?: VehiculoDatos) => void;
  
  // Estado y funciones de la tabla
  vehiculos: VehiculoDatosTabla[];
  setVehiculos: React.Dispatch<React.SetStateAction<VehiculoDatosTabla[]>>;
  loadingTable: boolean;
  errorTable: string | null;
  cargarVehiculos: () => Promise<void>;
  currentVehiculo: VehiculoDatosTabla | undefined;
  setCurrentVehiculo: React.Dispatch<React.SetStateAction<VehiculoDatosTabla | undefined>>;
  
  // Funciones de modal
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  openModal: () => void;
  closeModal: () => void;
  
  // Operaciones CRUD
  modificar: (vehiculoId: number) => void;
  eliminar: (vehiculoId: number) => void;
  confirmDelete: (vehiculoId: number) => void;
}

// Crear el contexto con un valor inicial
const VehiculoContext = createContext<VehiculoContextType | undefined>(undefined);

// Props para el provider
interface VehiculoProviderProps {
  children: ReactNode;
}

// Provider component
export const VehiculoProvider: React.FC<VehiculoProviderProps> = ({ children }) => {
  // Estados del formulario
  const [formData, setFormData] = useState<VehiculoDatos>({
    vehiculoModelo: "",
    totalChaperia: "",
    totalPintura: "",
    total:""
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  // Estados de la tabla
  const [vehiculos, setVehiculos] = useState<VehiculoDatosTabla[]>([]);
  const [loadingTable, setLoadingTable] = useState<boolean>(false);
  const [errorTable, setErrorTable] = useState<string | null>(null);
  const [currentVehiculo, setCurrentVehiculo] = useState<VehiculoDatosTabla | undefined>(undefined);
  
  // Estado del modal
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // Efecto para cargar los vehículos cuando se inicia
  useEffect(() => {
    cargarVehiculos();
  }, []);

  // Manejador de cambios en el formulario
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
    // Limpiar error al escribir
    if (error) setError(null);
  };

  // Función para resetear el formulario
  const resetForm = () => {
    setFormData({
      vehiculoModelo: "",
      totalChaperia: "",
      totalPintura: "",
      total:""
    });
    setError(null);
  };

  // Función para inicializar el formulario (edición o nuevo)
  const initializeForm = (vehiculoData?: VehiculoDatos) => {
    if (vehiculoData && isEditing) {
      setFormData(vehiculoData);
    } else {
      resetForm();
    }
  };

  // Función para abrir el modal
  const openModal = () => {
    setIsEditing(false);
    setCurrentVehiculo(undefined);
    resetForm();
    setIsModalOpen(true);
  };

  // Función para cerrar el modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Función para cargar los vehículos desde la API
  const cargarVehiculos = async () => {
    try {
      setLoadingTable(true);
      setErrorTable(null);

      const response = await axios.get(Api);
    //   console.log("Datos recibidos:", response.data);
      setVehiculos(response.data);
    } catch (err) {
      console.error("Error al cargar vehículos:", err);
      setErrorTable("No se pudieron cargar los vehículos. Intenta de nuevo más tarde.");
    } finally {
      setLoadingTable(false);
    }
  };

  // Función para guardar en la API
  const saveVehiculo = async () => {
    // Validación básica
    if (!formData.vehiculoModelo || typeof formData.vehiculoModelo === 'string' && !formData.vehiculoModelo.trim()) {
      setError("El modelo del vehículo es obligatorio");
      return null;
    }
    
    if (
      formData.totalChaperia === undefined || 
      formData.totalChaperia === null || 
      (typeof formData.totalChaperia === 'string' && !formData.totalChaperia.trim())
    ) {
      setError("El total de chapería es obligatorio");
      return null;
    }
    
    if (
      formData.totalPintura === undefined || 
      formData.totalPintura === null || 
      (typeof formData.totalPintura === 'string' && !formData.totalPintura.trim())
    ) {
      setError("El total de pintura es obligatorio");
      return null;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Petición a la API
      let response;
      if (isEditing) {
        response = await axios.put(`${Api}/${formData.id}`, formData);
      } else {
        response = await axios.post(Api, formData);
      }

      console.log("Operación exitosa:", response.data);
      Swal.fire({
        position: "top-end",
        icon: "success",
        theme:"auto",
        title: "El vehiculo se ha modificado con éxito",
        showConfirmButton: false,
        timer: 1500
      });
      
      // Actualizar la lista de vehículos
      setVehiculos((prevVehiculos) => {
        const index = prevVehiculos.findIndex(v => v.id === response.data.id);
        
        if (index !== -1) {
          // Si existe, lo reemplazamos
          const updatedVehiculos = [...prevVehiculos];
          updatedVehiculos[index] = response.data;
          return updatedVehiculos;
        } else {
          // Si no existe, lo añadimos al final
          const updatedVehiculos = [...prevVehiculos, response.data];
          return updatedVehiculos.sort((a, b) => a.id - b.id); // Ordenar por ID
        }
      });
      
      resetForm();
      closeModal();
      return response.data;
    } catch (err) {
      console.error("Error al guardar:", err);
      setError("Ocurrió un error al guardar. Inténtalo de nuevo.");
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Función para modificar un vehículo
  const modificar = (vehiculoId: number) => {
    axios.get(`${Api}/${vehiculoId}`)
      .then(response => {
        setCurrentVehiculo(response.data);
        setFormData(response.data);
        setIsEditing(true);
        setIsModalOpen(true);
      })
      .catch(error => {
        console.error("Error al obtener datos del vehículo:", error);
        setErrorTable("Error al obtener datos del vehículo para editar");
      });
  };

  // Función para eliminar un vehículo
  const eliminar = async (vehiculoId: number) => {
    try {
      const response = await axios.delete(`${Api}/${vehiculoId}`);

      if (response.status === 204) {
       // console.log("Vehículo eliminado con éxito");
        // Eliminamos el vehículo del estado local
        setVehiculos((prevVehiculos) =>
          prevVehiculos.filter((vehiculo) => vehiculo.id !== vehiculoId)
        );
        Swal.fire("¡Eliminado!", "El vehículo ha sido eliminado.", "success");
      }
    } catch (err) {
      console.error("Error al borrar el vehículo:", err);
      setErrorTable("No se pudo borrar el vehículo. Intenta de nuevo más tarde.");
    }
  };

  // Función para confirmar eliminación
  const confirmDelete = (vehiculoId: number) => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción no se puede revertir",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        eliminar(vehiculoId);
      }
    });
  };

  // Valor del contexto
  const value = {
    // Formulario
    formData,
    setFormData,
    isLoading,
    error,
    setError,
    handleChange,
    saveVehiculo,
    resetForm,
    isEditing,
    setIsEditing,
    initializeForm,
    
    // Tabla
    vehiculos,
    setVehiculos,
    loadingTable,
    errorTable,
    cargarVehiculos,
    currentVehiculo,
    setCurrentVehiculo,
    
    // Modal
    isModalOpen,
    setIsModalOpen,
    openModal,
    closeModal,
    
    // Operaciones CRUD
    modificar,
    eliminar,
    confirmDelete
  };

  return (
    <VehiculoContext.Provider value={value}>
      {children}
    </VehiculoContext.Provider>
  );
};

// Hook personalizado para usar el contexto
export const useVehiculoContext = () => {
  const context = useContext(VehiculoContext);
  if (context === undefined) {
    throw new Error('useVehiculoContext debe usarse dentro de un VehiculoProvider');
  }
  return context;
};