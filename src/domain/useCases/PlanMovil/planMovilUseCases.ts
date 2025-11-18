// src\domain\useCases\PlanMovil\planMovilUseCases.ts
import { PlanMovil } from "../../models/PlanMovil";

const API_URL = "https://tu-backend-url.com"; // Reemplázalo según corresponda

export const planMovilUseCases = {
  // Obtener todos los planes
  async obtenerPlanes(): Promise<PlanMovil[]> {
    const response = await fetch(`${API_URL}/planes`);
    if (!response.ok) throw new Error("Error al obtener los planes");
    return response.json();
  },

  // Buscar planes por nombre o descripción
  async buscarPlanes(termino: string): Promise<PlanMovil[]> {
    const response = await fetch(`${API_URL}/planes?search=${termino}`);
    if (!response.ok) throw new Error("Error al buscar los planes");
    return response.json();
  },

  // Eliminar un plan por ID
  async eliminarPlan(id: string): Promise<void> {
    const response = await fetch(`${API_URL}/planes/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Error al eliminar el plan");
  },
};
