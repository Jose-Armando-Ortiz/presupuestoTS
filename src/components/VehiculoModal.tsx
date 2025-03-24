import React, { useRef, useEffect } from "react";
import { useVehiculoContext } from "../context/VehiculosContext";

interface VehiculoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const VehiculoModal: React.FC<VehiculoModalProps> = ({ isOpen, onClose }) => {
  // Usamos el contexto
  const {
    formData,
    handleChange,
    error,
    isLoading,
    saveVehiculo,
    isEditing
  } = useVehiculoContext();

  const formRef = useRef<HTMLFormElement>(null);

  // Manejador del envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await saveVehiculo();
  };

  // Si el modal no está abierto, no renderizamos nada
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-cyan-950 flex justify-center items-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-cyan-700 text-white rounded-lg p-6 w-full max-w-md shadow-lg relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-2 right-2 text-white text-xl bg-transparent border-none cursor-pointer w-6 h-6 flex items-center justify-center rounded-full hover:bg-red-600"
          onClick={onClose}
        >
          ×
        </button>

        <h2 className="text-xl font-bold mb-4">
          {isEditing ? "Editar Vehículo" : "Añadir Nuevo Vehículo"}
        </h2>

        <form ref={formRef} onSubmit={handleSubmit}>
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