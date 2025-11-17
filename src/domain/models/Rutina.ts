/**
 * Modelo de Rutina
 * Representa un plan de entrenamiento con ejercicios.
 *
 * Una rutina es creada por un entrenador y puede ser asignada a uno o varios usuarios.
 */

export interface Rutina {
  id: string;               // UUID único de la rutina
  titulo: string;           // Nombre de la rutina (e.g. "Pierna - Semana 1")
  descripcion?: string;     // (Opcional) Descripción general
  ejercicios: Ejercicio[];  // Lista de ejercicios incluidos en la rutina
  entrenadorId: string;     // ID del entrenador que la creó
  imagenUrl?: string;       // (Opcional) URL de imagen de portada
  createdAt: string;        // Fecha de creación en formato ISO string
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
