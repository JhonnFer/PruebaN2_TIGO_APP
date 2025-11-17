import { supabase } from "@/src/data/services/supabaseClient";
import { Rutina } from "@/src/domain/models/Rutina";

export const RutinaUseCase = {
  async createRutina(rutina: Omit<Rutina, "id" | "created_at">) {
    const { data, error } = await supabase.from("rutinas").insert(rutina).select().single();
    if (error) throw error;
    return data;
  },

  async getRutinasDelEntrenador(entrenadorId: string) {
    const { data, error } = await supabase
      .from("rutinas")
      .select("*")
      .eq("entrenador_id", entrenadorId);
    if (error) throw error;
    return data;
  },

  async getRutinasDelUsuario(usuarioId: string) {
    const { data, error } = await supabase.rpc("get_rutinas_asignadas", { usuario_id: usuarioId });
    if (error) throw error;
    return data;
  },
};
