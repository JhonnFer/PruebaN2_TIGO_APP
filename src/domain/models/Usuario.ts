/**
 * Modelo de Usuario
 * Representa la estructura de datos de un usuario en la aplicación.
 *
 * Este modelo es independiente de la implementación (Supabase, Firebase, etc.)
 * Define el "contrato" de qué es un usuario en nuestra aplicación.
 */

export interface Usuario {
  id: string;                 // UUID único del usuario generado por Supabase
  email: string;              // Email para login
  nombre?: string;            // Nombre opcional
  rol: "entrenador" | "usuario"; // Dos tipos de usuarios permitidos
  fechaRegistro?: string;     // (Opcional) Fecha en que se registró
  entrenadorId?: string;      // (Sólo para usuarios) ID de su entrenador asignado
}
