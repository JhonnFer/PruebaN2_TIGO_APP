// src/presentation/hooks/useChat.ts
import { useState, useEffect } from "react";
import { chatRepository } from "@/src/data/repositories/ChatRepositoryImpl";
import { Mensaje } from "@/src/domain/models/Mensaje";

export function useChat(conversacionId?: string) {
  const [mensajes, setMensajes] = useState<Mensaje[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      setCargando(true);
      try {
        let data: Mensaje[];
        if (conversacionId) {
          data = await chatRepository.obtenerMensajes(conversacionId);
        } else {
          data = await chatRepository.obtenerConversaciones();
        }
        setMensajes(data);
      } finally {
        setCargando(false);
      }
    };
    fetch();
  }, [conversacionId]);

  const enviar = async (usuarioId: string, contenido: string) => {
    if (!conversacionId) return;
    const msg = await chatRepository.enviarMensaje(conversacionId, usuarioId, contenido);
    setMensajes(prev => [...prev, msg]);
  };

  return { mensajes, cargando, enviar };
}
