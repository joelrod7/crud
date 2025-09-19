export type TaskEstado = 0 | 1 | 2;

export interface Task {
  id: number;
  titulo: string;
  descripcion: string;
  fecha_creacion: string;
  fecha_inicio: string;
  fecha_fin: string;
  estado: TaskEstado;
  persona?: number;
}

export interface CreateTaskDto {
  titulo: string;
  descripcion: string;
  fecha_inicio: string;
  fecha_fin: string;
  estado: TaskEstado;
  persona?: number;
}

export const TASK_STATUS_OPTIONS: { label: string; value: TaskEstado }[] = [
  { label: 'Sin selección', value: 0 },
  { label: 'Pendiente',   value: 1 },
  { label: 'Completada',  value: 2 },
];

export interface Paginated<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}
