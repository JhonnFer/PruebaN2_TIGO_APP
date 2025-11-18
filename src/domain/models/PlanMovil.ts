// src/domain/models/PlanMovil.ts
export interface PlanMovil {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  imagenUrl?: string; // Opcional si permites subir imágenes
  creadoPor?: string; // Email del asesor que lo creó
  creadoEn?: string; // Fecha de creación
}
