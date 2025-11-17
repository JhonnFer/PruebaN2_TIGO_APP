export interface Progreso {
  id: string;               // UUID generado por Supabase
  userId: string;           // ID del usuario (relación con la tabla perfiles / usuarios)
  rutinaId: string;         // ID de la rutina a la que pertenece el progreso
  fecha: string;            // Fecha del registro (YYYY-MM-DD)
  descripcion?: string;     // Comentario opcional del usuario sobre su progreso
  peso?: number;            // Peso usado (si aplica)
  repeticiones?: number;    // Número de repeticiones (si aplica)
  duracion?: number;        // Duración del ejercicio o rutina en minutos (si aplica)
  created_at?: string;      // Generado por Supabase automáticamente
}
