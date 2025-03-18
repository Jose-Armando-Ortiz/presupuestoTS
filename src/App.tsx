// App.tsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import VehiculoModal from "./components/VehiculoModal";
import Header from "./components/Header";
import { Api, VehiculoDatosTabla } from "./types/VehiculosType";
import Swal from "sweetalert2";

const App: React.FC = (setFormData) => {
  //alert para eliminar

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
        handleDeleteSuccess(vehiculoId);
        Swal.fire("¡Eliminado!", "El vehículo ha sido eliminado.", "success");
      }
    });
  };

 
  

  // Estado para controlar si el modal está abierto o cerrado
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Estado para almacenar la lista de vehículos
  const [vehiculos, setVehiculos] = useState<VehiculoDatosTabla[]>([]);

  // Estado para manejar carga y errores
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [currentVehiculo, setCurrentVehiculo] = useState<VehiculoDatosTabla | undefined>(undefined);

  // Función para cargar los vehículos desde la API

  const cargarVehiculos = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get("http://localhost:8085/api/vehiculos");

      console.log("Datos recibidos:", response.data); // Verifica que el modelo esté aquí
      setVehiculos(response.data);
    } catch (err) {
      console.error("Error al cargar vehículos:", err);
      setError(
        "No se pudieron cargar los vehículos. Intenta de nuevo más tarde."
      );
    } finally {
      setLoading(false);
    }
  };

  // Cargar vehículos al montar el componente
  useEffect(() => {
    cargarVehiculos();
  }, []);

  // Función para abrir el modal
  const openModal = () => {
    setIsModalOpen(true);
    
  };

  // Función para cerrar el modal
  const closeModal = () => {
    setIsModalOpen(false);
  };
  
  // Función para manejar el guardado exitoso
  const handleSaveSuccess = (vehiculo: VehiculoDatosTabla) => {
    setVehiculos((prevVehiculos) => {
      // Verificamos si el vehículo ya existe (edición)
      const index = prevVehiculos.findIndex(v => v.id === vehiculo.id);
      
      if (index !== -1) {
        // Si existe, reemplazamos el vehículo en esa posición
        const updatedVehiculos = [...prevVehiculos];
        updatedVehiculos[index] = vehiculo;
        return updatedVehiculos;
        
      } else {
        // Si no existe, lo añadimos al final (es nuevo)
        const updatedVehiculos = [...prevVehiculos, vehiculo];
        return updatedVehiculos.sort((a, b) => a.id - b.id); // Ordenar por ID
      }
    });
  };
  
  
  //funcion para modificar
  const modificar = (vehiculoId: number) => {
    // Obtenemos los datos del vehículo
    axios.get(`${Api}/${vehiculoId}`)
      .then(response => {
        setCurrentVehiculo(response.data);
        setIsEditing(true);
        setIsModalOpen(true);
       
      })
      .catch(error => {
        console.error("Error al obtener datos del vehículo:", error);
      });
  };

  // Función para manejar el borrado exitoso
  const handleDeleteSuccess = async (vehiculoId: number) => {
    try {
      const response = await axios.delete(
        `http://localhost:8085/api/vehiculos/${vehiculoId}`
      );

      if (response.status === 204) {
        console.log("Vehículo eliminado con éxito");
        // Eliminamos el vehículo del estado local
        setVehiculos((prevVehiculos) =>
          prevVehiculos.filter((vehiculo) => vehiculo.id !== vehiculoId)
        );
      }
    } catch (err) {
      console.error("Error al borrar el vehículo:", err);
      setError("No se pudo borrar el vehículo. Intenta de nuevo más tarde.");
    }
  };
  // Función para restablecer el formulario

  return (
    <>
      <Header />
      <div className="p-6 bg-gray-100 min-h-screen">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold mb-4">Gestión de Vehículos</h1>

          <button
            className="bg-cyan-700 hover:bg-cyan-800 text-white py-2 px-4 rounded-md transition-colors duration-300 mb-6"
            onClick={openModal}
          >
            Añadir Vehículo
          </button>

          {/* Mensaje de error global */}
          {error && (
            <div className="mb-6 p-3 bg-red-100 text-red-700 rounded-md">
              {error}
              <button
                className="ml-2 text-red-500 font-medium"
                onClick={cargarVehiculos}
              >
                Reintentar
              </button>
            </div>
          )}

          {/* Estado de carga */}
          {loading ? (
            <p className="text-gray-500 italic">Cargando vehículos...</p>
          ) : (
            <>
              {/* Lista de vehículos */}
              {vehiculos.length === 0 ? (
                <p className="text-gray-500">No hay vehículos registrados.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white">
                    <thead>
                      <tr className="bg-gray-100 text-gray-600 uppercase text-sm">
                        <th className="py-3 px-4 text-left">Modelo</th>
                        <th className="py-3 px-4 text-right">Chapería</th>
                        <th className="py-3 px-4 text-right">Pintura</th>
                        <th className="py-3 px-4 text-right">Total</th>
                        <th className="py-3 px-4 text-right">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="text-gray-600">
                      {vehiculos.map((vehiculo) => {
                        // Calculamos el total
                        const chaperia =
                          parseFloat(vehiculo.totalChaperia) || 0;
                        const pintura = parseFloat(vehiculo.totalPintura) || 0;
                        const total = chaperia + pintura;

                        return (
                          <tr
                            key={vehiculo.id}
                            className="border-b border-gray-200 hover:bg-gray-50"
                          >
                            <td className="py-3 px-4">
                              {vehiculo.id}. {vehiculo.vehiculoModelo}
                            </td>
                            <td className="py-3 px-4 text-right">
                              {chaperia.toFixed(2)} GS
                            </td>
                            <td className="py-3 px-4 text-right">
                              {pintura.toFixed(2)} GS
                            </td>
                            <td className="py-3 px-4 text-right font-medium">
                              {total.toFixed(2)} GS
                            </td>
                            <td className="py-3 px-4 text-right font-medium">
                              <button
                                type="submit"
                                onClick={()=>modificar(vehiculo.id)}
                                className=" h-5 w-5 mx-10 cursor-pointer"
                              >
                                <img src="img\edit.svg" alt="off" />
                              </button>
                              <button
                                type="submit"
                                className=" h-5 w-5 cursor-pointer "
                                onClick={() => confirmDelete(vehiculo.id)}
                              >
                                <img src="img\delete.svg" alt="off" />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
        </div>

        {/* Componente Modal */}
        <VehiculoModal
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)}
          onSaveSuccess={handleSaveSuccess}
          vehiculoData={currentVehiculo}
          isEditing={isEditing}
        />
      </div>
    </>
  );
};

export default App;
