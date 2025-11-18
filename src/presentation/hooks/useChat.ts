// src/presentation/hooks/useChat.ts
import { chatRepository } from "@/src/data/repositories/ChatRepositoryImpl";
import { Mensaje } from "@/src/domain/models/Mensaje";
import { useCallback, useEffect, useRef, useState } from "react";
import { useAuth } from "./useAuth";

export function useChat(destinatarioId?: string) {
  const { usuario } = useAuth();
  const [mensajes, setMensajes] = useState<Mensaje[]>([]);
  const [conversaciones, setConversaciones] = useState<Mensaje[]>([]);
  const [cargando, setCargando] = useState(true);
  const [escribiendo, setEscribiendo] = useState(false);
  const unsubscribeRef = useRef<(() => void) | null>(null);

  /**
   * Cargar mensajes de un destinatario específico y suscribirse a cambios
   */
  useEffect(() => {
    if (!destinatarioId || !usuario) return;

    const cargarMensajes = async () => {
      try {
        setCargando(true);
        // Cargar mensajes existentes
        const datos = await chatRepository.obtenerMensajes(destinatarioId);
        setMensajes(datos);

        // Suscribirse a nuevos mensajes en tiempo real
        unsubscribeRef.current = chatRepository.subscribeToMensajes(
          destinatarioId,
          (nuevoMensaje) => {
            setMensajes((prev) => [...prev, nuevoMensaje]);
          }
        );
      } catch (error) {
        console.error("Error cargando mensajes:", error);
      } finally {
        setCargando(false);
      }
    };

    cargarMensajes();

    // Cleanup: desuscribirse al desmontar o cambiar destinatarioId
    return () => {
      if (unsubscribeRef.current) unsubscribeRef.current();
    };
  }, [destinatarioId, usuario]);

  /**
   * Cargar conversaciones (primera vez o cuando no hay destinatarioId seleccionado)
   */
  useEffect(() => {
    if (destinatarioId || !usuario) return;

    const cargarConversaciones = async () => {
      try {
        setCargando(true);
        const datos = await chatRepository.obtenerConversaciones();
        setConversaciones(datos);
      } catch (error) {
        console.error("Error cargando conversaciones:", error);
      } finally {
        setCargando(false);
      }
    };

    cargarConversaciones();
  }, [destinatarioId, usuario]);

  /**
   * Enviar mensaje
   */
  const enviarMensaje = useCallback(
    async (contenido: string) => {
      if (!destinatarioId || !usuario || !contenido.trim()) return;

      try {
        setEscribiendo(true);
        const nuevoMensaje = await chatRepository.enviarMensaje(
          destinatarioId,
          usuario.usuarioid,
          contenido
        );
        setMensajes((prev) => [...prev, nuevoMensaje]);
        return nuevoMensaje;
      } catch (error) {
        console.error("Error enviando mensaje:", error);
        throw error;
      } finally {
        setEscribiendo(false);
      }
    },
    [destinatarioId, usuario]
  );

  /**
   * Marcar mensaje como leído
   */
  const marcarComoLeido = useCallback(async (mensajeId: string) => {
    try {
      await chatRepository.marcarComoLeido(mensajeId);
      setMensajes((prev) =>
        prev.map((m) => (m.mensajeid === mensajeId ? { ...m, leido: true } : m))
      );
    } catch (error) {
      console.error("Error marcando como leído:", error);
    }
  }, []);

  return {
    mensajes,
    conversaciones,
    cargando,
    escribiendo,
    enviarMensaje,
    marcarComoLeido,
  };
}
