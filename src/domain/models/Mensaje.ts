// src/domain/models/Mensaje.ts
export interface Usuario {
  usuarioid: string;
  nombre: string;
  email: string;
}

export interface Mensaje {
  mensajeid: string;
  destinatarioid: string; // Referencia al destinatario
  usuarioid: string;
  mensaje: string;
  leido: boolean;
  created_at: string;
  usuario?: Usuario;
}
