// src/domain/repositories/ChatRepository.ts
import { Mensaje } from "../models/Mensaje";

export interface ChatRepository {
  // Obtener conversaciones (historial único por contratación)
  obtenerConversaciones(): Promise<Mensaje[]>;

  // Obtener todos los mensajes de una contratación
  obtenerMensajes(contratacionId: string): Promise<Mensaje[]>;

  // Enviar mensaje a una contratación
  enviarMensaje(
    contratacionId: string,
    usuarioId: string,
    contenido: string
  ): Promise<Mensaje>;

  // Suscribirse a cambios en tiempo real
  subscribeToMensajes(
    contratacionId: string,
    callback: (mensaje: Mensaje) => void
  ): () => void;

  // Marcar mensaje como leído
  marcarComoLeido(mensajeId: string): Promise<void>;
}
