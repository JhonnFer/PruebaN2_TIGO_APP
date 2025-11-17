/**
 * Modelo de Rutina
 * Representa un plan de entrenamiento con ejercicios.
 *
 * Una rutina es creada por un entrenador y puede ser asignada a uno o varios usuarios.
 */

export interface Rutina {
  id: string;
  titulo: string;
  descripcion?: string;
  objetivo?: string;
  ejercicios: Ejercicio[];
  entrenadorId: string;
  imagenUrl?: string;
  createdAt?: string;  // <--- Hazlo opcional
}

/**
 * Modelo de Ejercicio dentro de una rutina
 */
export interface Ejercicio {
  nombre: string;          // Nombre del ejercicio (e.g. Sentadilla Libre)
  series: number;          // Cantidad de series
  repeticiones: string;    // Repeticiones por serie (ej. "12-10-8")
  videoUrl?: string;       // (Opcional) Enlace al video demostrativo en Supabase Storage
}
