// Define la URL base de la API
export const Api = "http://localhost:8085/api/vehiculos";

// Define la estructura de datos para los vehículos
export interface VehiculoDatos {
  id?: number;
  vehiculoModelo: string;
  totalChaperia: string | number;
  totalPintura: string | number;
  total:string| number;
}

// Interface para los datos que se muestran en la tabla
export interface VehiculoDatosTabla extends VehiculoDatos {
  id: number;
}

// Props para el modal de vehículos
export interface VehiculoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveSuccess?: (data: any) => void;
  vehiculoData?: VehiculoDatos;
  isEditing?: boolean;
}