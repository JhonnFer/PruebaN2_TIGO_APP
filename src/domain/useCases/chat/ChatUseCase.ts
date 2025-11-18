import { ChatRepository } from "@/src/domain/repositories/ChatRepository";
import { Conversacion } from "@/src/domain/models/Conversacion";

export class ChatUseCase {
  constructor(private chatRepository: ChatRepository) {}

async obtenerConversaciones(): Promise<Conversacion[]> {
    return this.chatRepository.obtenerConversaciones();
  }
  async enviarMensaje(usuarioId: string, contenido: string): Promise<void> {
    return this.chatRepository.enviarMensaje(usuarioId, contenido);
  }
}
