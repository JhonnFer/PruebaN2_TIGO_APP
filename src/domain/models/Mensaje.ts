// src/domain/models/Mensaje.ts
export interface Usuario {
  id: string;
  nombre: string;
  email: string;
}

export interface Mensaje {
  id: string;
  conversacion_id: string;
  usuario_id: string;
  contenido: string;
  leido: boolean;
  created_at: string;
  usuario?: Usuario;
}
