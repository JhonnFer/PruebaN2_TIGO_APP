// src/data/repositories/ChatRepositoryImpl.ts
import { Mensaje } from "@/src/domain/models/Mensaje";
import { ChatRepository } from "@/src/domain/repositories/ChatRepository";
import { supabase } from "../services/supabaseClient";

export class ChatRepositoryImpl implements ChatRepository {
  /**
   * Obtener todas las conversaciones (únicas por destinatario)
   * Agrupa por destinatarioid y obtiene el último mensaje
   */
  async obtenerConversaciones(): Promise<Mensaje[]> {
    const { data, error } = await supabase
      .from("mensajes")
      .select(
        `
        mensajeid,
        usuarioid,
        destinatarioid,
        mensaje,
        leido,
        created_at,
        usuario:usuarios(usuarioid, nombre, email)
      `
      )
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);

    // Filtrar conversaciones únicas (una por destinatario)
    const conversacionesMap = new Map();
    (data as any[]).forEach((msg) => {
      if (!conversacionesMap.has(msg.destinatarioid)) {
        conversacionesMap.set(msg.destinatarioid, msg);
      }
    });

    return Array.from(conversacionesMap.values()) as unknown as Mensaje[];
  }

  /**
   * Obtener todos los mensajes de una conversación
   */
  async obtenerMensajes(destinatarioId: string): Promise<Mensaje[]> {
    const { data, error } = await supabase
      .from("mensajes")
      .select(
        `
        mensajeid,
        usuarioid,
        destinatarioid,
        mensaje,
        leido,
        created_at,
        usuario:usuarios(usuarioid, nombre, email)
      `
      )
      .eq("destinatarioid", destinatarioId)
      .order("created_at", { ascending: true });

    if (error) throw new Error(error.message);
    return data as unknown as Mensaje[];
  }

  /**
   * Enviar mensaje a un destinatario
   */
  async enviarMensaje(
    destinatarioId: string,
    usuarioId: string,
    mensaje: string
  ): Promise<Mensaje> {
    const { data, error } = await supabase
      .from("mensajes")
      .insert([
        {
          destinatarioid: destinatarioId,
          usuarioid: usuarioId,
          mensaje,
          leido: false,
        },
      ])
      .select(
        `
        mensajeid,
        usuarioid,
        destinatarioid,
        mensaje,
        leido,
        created_at,
        usuario:usuarios(usuarioid, nombre, email)
      `
      )
      .single();

    if (error) throw new Error(error.message);
    return data as unknown as Mensaje;
  }

  /**
   * Suscribirse a cambios en tiempo real de mensajes
   */
  subscribeToMensajes(
    destinatarioId: string,
    callback: (mensaje: Mensaje) => void
  ) {
    const channel = supabase
      .channel(`mensajes:${destinatarioId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "mensajes",
          filter: `destinatarioid=eq.${destinatarioId}`,
        },
        (payload) => {
          callback(payload.new as Mensaje);
        }
      )
      .subscribe();

    // Retornar función para desuscribirse
    return () => {
      supabase.removeChannel(channel);
    };
  }

  /**
   * Marcar mensaje como leído
   */
  async marcarComoLeido(mensajeId: string): Promise<void> {
    const { error } = await supabase
      .from("mensajes")
      .update({ leido: true })
      .eq("mensajeid", mensajeId);

    if (error) throw new Error(error.message);
  }
}

export const chatRepository = new ChatRepositoryImpl();
