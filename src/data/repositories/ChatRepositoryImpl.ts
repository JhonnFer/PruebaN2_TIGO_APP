// src/data/repositories/ChatRepositoryImpl.ts
import { ChatRepository } from "@/src/domain/repositories/ChatRepository";
import { Mensaje } from "@/src/domain/models/Mensaje";
import { supabase } from "../services/supabaseClient";

export class ChatRepositoryImpl implements ChatRepository {
  async obtenerConversaciones(): Promise<Mensaje[]> {
    const { data, error } = await supabase
      .from("mensajes")
      .select(`
        *,
        usuario:usuarios(nombre,email)
      `)
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);
    return data as Mensaje[];
  }

  async obtenerMensajes(conversacionId: string): Promise<Mensaje[]> {
    const { data, error } = await supabase
      .from("mensajes")
      .select(`
        *,
        usuario:usuarios(nombre,email)
      `)
      .eq("conversacion_id", conversacionId)
      .order("created_at", { ascending: true });

    if (error) throw new Error(error.message);
    return data as Mensaje[];
  }

  async enviarMensaje(conversacionId: string, usuarioId: string, contenido: string): Promise<Mensaje> {
    const { data, error } = await supabase
      .from("mensajes")
      .insert([{ conversacion_id: conversacionId, usuarioid: usuarioId, contenido }])
      .select(`
        *,
        usuario:usuarios(nombre,email)
      `)
      .single();

    if (error) throw new Error(error.message);
    return data as Mensaje;
  }
}

export const chatRepository = new ChatRepositoryImpl();
