import { SolicitudRepository } from "../../domain/repositories/SolicitudRepository";
import { Solicitud } from "../../domain/models/Solicitud";
import { supabase } from "../services/supabaseClient";

export class SolicitudRepositoryImpl implements SolicitudRepository {
  async listarSolicitudes(): Promise<Solicitud[]> {
    const { data, error } = await supabase.from("solicitudes").select("*");
    if (error) throw error;
    return data as Solicitud[];
  }

  async aprobarSolicitud(id: string): Promise<void> {
    const { error } = await supabase
      .from("solicitudes")
      .update({ estado: "aprobado", fechaRespuesta: new Date().toISOString() })
      .eq("solicitudId", id);
    if (error) throw error;
  }

  async rechazarSolicitud(id: string): Promise<void> {
    const { error } = await supabase
      .from("solicitudes")
      .update({ estado: "rechazado", fechaRespuesta: new Date().toISOString() })
      .eq("solicitudId", id);
    if (error) throw error;
  }
}
