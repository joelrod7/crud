export interface Task {
  id: number;
  titulo: string;
  descripcion: string;
  fecha_creacion: string;
  fecha_inicio: string;
  fecha_fin: string;
  estado: number;
}

export interface CreateTaskDto {
  titulo: string;
  descripcion: string;
  fecha_inicio: string;
  fecha_fin: string;
  estado: number;
}
