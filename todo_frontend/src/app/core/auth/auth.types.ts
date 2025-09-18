export interface PersonaRegisterDto {
  ident: number;
  nombre: string;
  apellido: string;
  correo: string;
  password: string;
}

export interface LoginDto {
  correo: string;
  password: string;
}

export interface TokenResponse {
  access: string;
  refresh?: string;
}
