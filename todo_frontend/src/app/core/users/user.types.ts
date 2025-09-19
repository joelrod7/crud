export interface Persona {
  id: number;
  ident: number;
  nombre: string;
  apellido: string;
  correo: string;
  rol?: number;
}

export interface CreatePersonaDto {
  ident: number;
  nombre: string;
  apellido: string;
  correo: string;
  password: string;
  rol?: number;
}
