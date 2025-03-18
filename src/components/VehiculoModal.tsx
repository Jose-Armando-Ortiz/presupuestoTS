// VehiculoModal.tsx
import VehiculoDatos from "../types/VehiculosType";
import React, { useState } from "react";
import axios from "axios"; // Necesitarás instalar axios: npm install axios
import { VehiculoModalProps, Api } from "../types/VehiculosType";

// Definimos la estructura de datos para el vehículo

// Componente principal del modal
const VehiculoModal: React.FC<VehiculoModalProps> = ({
  isOpen,
  onClose,
  onSaveSuccess,
  vehiculoData,
  isEditing = false,
  
}) => {
  // Estado para almacenar los datos del formulario
  const [formData, setFormData] = useState<VehiculoDatos>({
    vehiculoModelo: "",
    totalChaperia: "",
    totalPintura: "",
  });
  React.useEffect(() => {
    if (vehiculoData && isEditing) {
      setFormData(vehiculoData);
    } else {
      setFormData({
        vehiculoModelo: "",
        totalChaperia: "",
        totalPintura: "",
      });
    }
  }, [vehiculoData, isEditing, isOpen]);
  

  // Estado para manejar errores y carga
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Función para manejar cambios en los inputs
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
    // Si había un error, lo limpiamos cuando el usuario empieza a escribir
    if (error) setError(null);
  };
  
  

  // Función para enviar los datos a la API Modificar e insertar
  const formRef = React.useRef<HTMLFormElement>(null);

const saveToAPI = async (vehiculoData: VehiculoDatos) => {
  try {
    setIsLoading(true);
    setError(null);

    // Realizamos la petición a la API
    let response;
    if (isEditing) {
      response = await axios.put(`${Api}/${vehiculoData.id}`, vehiculoData);
    } else {
      response = await axios.post(Api, vehiculoData);
    }

    // Si llegamos aquí, la solicitud fue exitosa
    console.log("Operación exitosa:", response.data);

    // Llamamos al callback con los datos
    onSaveSuccess(response.data);

    // Limpiamos manualmente los inputs
    if (formRef.current) {
      const inputs = formRef.current.querySelectorAll('input');
      inputs.forEach(input => {
        input.value = '';
      });
    }

    // Forzamos un reseteo del estado también
    setFormData({
      vehiculoModelo: "",
      totalChaperia: "",
      totalPintura: "",
    });

    // Cerramos el modal
    onClose();
  } catch (err) {
    // Manejo de errores...
  } finally {
    setIsLoading(false);
  }
};
const  resetForm=()=>{
  setFormData({
    vehiculoModelo: "",
    totalChaperia: "",
    totalPintura: "",
  });
}



  // Función para manejar el envío del formulario
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validación básica
    if (!formData.vehiculoModelo || typeof formData.vehiculoModelo === 'string' && !formData.vehiculoModelo.trim()) {
      setError("El modelo del vehículo es obligatorio");
      return;
    }
    
    // Validación para totalChaperia podría ser string o número
    if (
      formData.totalChaperia === undefined || 
      formData.totalChaperia === null || 
      (typeof formData.totalChaperia === 'string' && !formData.totalChaperia.trim())
    ) {
      setError("El total de chapería es obligatorio");
      return;
    }
    
    // Validación para totalPintura podría ser string o número
    if (
      formData.totalPintura === undefined || 
      formData.totalPintura === null || 
      (typeof formData.totalPintura === 'string' && !formData.totalPintura.trim())
    ) {
      setError("El total de pintura es obligatorio");
      return;
    }
    
    // Llamamos a la función que se comunica con la API
    saveToAPI(formData);
  };
  // Si el modal no está abierto, no renderizamos nada
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-transparent bg-opacity-100 flex justify-center items-center z-50"
      onClick={onClose}
    >
      {/* Detenemos la propagación del click para evitar que el modal se cierre cuando se hace clic dentro de él */}
      <div
        className="bg-cyan-700 text-white rounded-lg p-6 w-full max-w-md shadow-lg relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-2 right-2 text-white text-xl bg-transparent border-none cursor-pointer w-6 h-6 flex items-center justify-center rounded-full hover:bg-red-600"
          onClick={onClose }
          onAbort={resetForm}
        >
          ×
        </button>

        <form  ref={formRef} onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="vehiculoModelo" className="block mb-1 text-base">
              Modelo del vehículo
            </label>
            <input
              type="text"
              id="vehiculoModelo"
              placeholder="Modelo del vehículo"
              className="w-full py-2 px-4 rounded-full bg-teal-800 text-white border-none text-base"
              value={formData.vehiculoModelo}
              onChange={handleChange}
              disabled={isLoading}
            />
          </div>

          <div className="mb-4">
            <label htmlFor="totalChaperia" className="block mb-1 text-base">
              Total chapería
            </label>
            <input
              type="text"
              id="totalChaperia"
              placeholder="Total chapería"
              className="w-full py-2 px-4 rounded-full bg-teal-800 text-white border-none text-base"
              value={formData.totalChaperia}
              onChange={handleChange}
              disabled={isLoading}
            />
          </div>

          <div className="mb-4">
            <label htmlFor="totalPintura" className="block mb-1 text-base">
              Total pintura
            </label>
            <input
              type="text"
              id="totalPintura"
              placeholder="Total pintura"
              className="w-full py-2 px-4 rounded-full bg-teal-800 text-white border-none text-base"
              value={formData.totalPintura}
              onChange={handleChange}
              disabled={isLoading}
            />
          </div>

          {/* Mensaje de error */}
          {error && (
            <div className="mb-4 p-2 bg-red-600 text-white rounded-md text-sm">
              {error}
            </div>
          )}

          <div className="text-center mt-6">
            <button
              type="submit"
              className={`bg-green-600 hover:bg-green-700 text-white py-2 px-8 rounded-full text-base cursor-pointer transition-colors duration-300 ${
                isLoading ? "opacity-70 cursor-not-allowed" : ""
              }`}
              disabled={isLoading}
            >
              {isLoading ? "Guardando..." : "Guardar"}
              
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VehiculoModal;
