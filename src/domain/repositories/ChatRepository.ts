// src/domain/repositories/ChatRepository.ts
import { Mensaje } from "../models/Mensaje";

export interface ChatRepository {
  obtenerConversaciones(): Promise<Mensaje[]>; // Para historial
  obtenerMensajes(conversacionId: string): Promise<Mensaje[]>; // Mensajes de una conversación
  enviarMensaje(conversacionId: string, usuarioId: string, contenido: string): Promise<Mensaje>;
}
