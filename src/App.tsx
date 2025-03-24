import Header from "./components/Header"; // Asumiendo que tienes este componente
import VehiculoModal from "./components/VehiculoModal";
import { VehiculoProvider, useVehiculoContext } from "./context/VehiculosContext";
import { useEffect, useState } from "react";



// Componente interno que usa el contexto
const VehiculosContent: React.FC = () => {
  const {
    vehiculos,
    loadingTable,
    errorTable,
    cargarVehiculos,
    openModal,
    modificar,
    confirmDelete,
    isModalOpen,
    closeModal,
  } = useVehiculoContext();
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode((prevMode) => !prevMode);
  };

  

  return (
    <div className="p-6 bg-gray-100 min-h-screen ">

      <div className="bg-white p-6 rounded-lg shadow-md">
        <section className="grid grid-cols-2">
          <div>
            <h1 className="text-2xl font-bold mb-4">Gestión de Vehículos</h1>
            <div>
            <button
              className="bg-cyan-700 hover:bg-cyan-800 text-white py-2 px-4 rounded-md transition-colors duration-300 mb-6"
              onClick={openModal}
            >
              Añadir Vehículo
            </button>

          </div>

          </div>
          
          <div className="bg-transparent rounded-2xl grid justify-end items-center">
            <button
              onClick={toggleDarkMode}
              className="px-4 py-2 bg-gray-200 dark:bg-cyan-950 rounded-2xl h-10 w-40"
            >
              {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
            </button>

          </div>

        </section>


        {/* Mensaje de error global */}
        {errorTable && (
          <div className="mb-6 p-3 bg-red-100 text-red-700 rounded-md">
            {errorTable}
            <button
              className="ml-2 text-red-500 font-medium"
              onClick={cargarVehiculos}
            >
              Reintentar
            </button>
          </div>
        )}

        {/* Estado de carga */}
        {loadingTable ? (
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
                    <tr className="bg-gray-100 text-gray-600 dark:bg-black uppercase text-sm">
                      <th className="py-3 px-4 text-left">Modelo</th>
                      <th className="py-3 px-4 text-right">Chapería</th>
                      <th className="py-3 px-4 text-right">Pintura</th>
                      <th className="py-3 px-4 text-right">Total</th>
                      <th className="py-3 px-4 text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-600">
                    {vehiculos.map((vehiculo) => {

                      const chaperia = vehiculo.totalChaperia;
                      const pintura = vehiculo.totalPintura;
                      const total = vehiculo.total;

                      return (
                        <tr
                          key={vehiculo.id}
                          className="border-b border-gray-200 hover:bg-gray-50"
                        >
                          <td className="py-3 px-4">
                            {vehiculo.id}. {vehiculo.vehiculoModelo}
                          </td>
                          <td className="py-3 px-4 text-right">
                            {chaperia} GS
                          </td>
                          <td className="py-3 px-4 text-right">
                            {pintura} GS
                          </td>
                          <td className="py-3 px-4 text-right font-medium">
                            {total} GS
                          </td>
                          <td className="py-3 px-4 text-right font-medium">
                            <button
                              type="submit"
                              onClick={() => modificar(vehiculo.id)}
                              className="h-5 w-5 mx-10 cursor-pointer"
                            >
                              <img src="img\edit.svg" alt="editar" />
                            </button>
                            <button
                              type="submit"
                              className="h-5 w-5 cursor-pointer"
                              onClick={() => confirmDelete(vehiculo.id)}
                            >
                              <img src="img\delete.svg" alt="eliminar" />
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
        onClose={closeModal}
      />
    </div>
  );
};

// Componente principal App que provee el contexto
const App: React.FC = () => {
  return (
    <VehiculoProvider>
      <Header />
      <VehiculosContent />
    </VehiculoProvider>
  );
};

export default App;