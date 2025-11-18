import { useState, useEffect } from "react";
import { supabase } from "@/src/data/services/supabaseClient";
import { Solicitud } from "@/src/domain/models/Solicitud";

export const useSolicitudes = () => {
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cargarSolicitudes = async () => {
    setCargando(true);
    setError(null);
    try {
      // Traemos datos de usuario y plan relacionados
      const { data, error } = await supabase
        .from("solicitudes")
        .select(`
          solicitudid,
          estado,
          created_at,
          usuarios(nombre) ,
          planes_moviles(nombre, precio)
        `);

      if (error) throw error;

      setSolicitudes(data as any);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setCargando(false);
    }
  };

  const aprobar = async (id: string) => {
    const { error } = await supabase
      .from("solicitudes")
      .update({ estado: "aprobada" })
      .eq("solicitudid", id);
    if (error) throw error;
    cargarSolicitudes();
  };

  const rechazar = async (id: string) => {
    const { error } = await supabase
      .from("solicitudes")
      .update({ estado: "rechazada" })
      .eq("solicitudid", id);
    if (error) throw error;
    cargarSolicitudes();
  };

  useEffect(() => {
    cargarSolicitudes();
  }, []);

  return { solicitudes, cargando, error, cargarSolicitudes, aprobar, rechazar };
};
