import { useState, useEffect } from "react";
import { RutinaUseCase } from "@/src/domain/useCases/rutina/RutinaUseCase";

export function useRutina(usuarioId: string) {
  const [rutinas, setRutinas] = useState([]);

  useEffect(() => {
    if (!usuarioId) return;

    RutinaUseCase.getRutinasDelUsuario(usuarioId)
      .then(setRutinas)
      .catch(console.error);
  }, [usuarioId]);

  return { rutinas, createRutina: RutinaUseCase.createRutina };
}
