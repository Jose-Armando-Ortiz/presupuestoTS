interface VehiculoDatos {
  id?: number; // ID opcional (para cuando se recibe desde la API)
  vehiculoModelo: string; // Modelo del vehículo
  totalChaperia: string; // Total de chapería
  totalPintura: string; // Total de pintura
}
export interface VehiculoDatosTabla {
  id: number; // ID opcional (para cuando se recibe desde la API)
  vehiculoModelo: string; // Modelo del vehículo
  totalChaperia: string; // Total de chapería
  totalPintura: string; // Total de pintura
}
export default VehiculoDatos;
export const Api = "http://localhost:8085/api/vehiculos";

// Definimos las propiedades que recibirá nuestro componente modal
export
interface VehiculoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveSuccess: (data: any) => void;
  vehiculoData?: VehiculoDatos; // Datos del vehículo a editar (opcional)
  isEditing?: boolean; // Indica si estamos editando o creando
}

