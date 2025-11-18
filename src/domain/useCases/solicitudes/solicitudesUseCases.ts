import { SolicitudRepository } from "../../repositories/SolicitudRepository";
import { Solicitud } from "../../models/Solicitud";

export class SolicitudesUseCases {
  constructor(private repo: SolicitudRepository) {}

  listar = async (): Promise<Solicitud[]> => {
    return await this.repo.listarSolicitudes();
  };

  aprobar = async (id: string) => {
    await this.repo.aprobarSolicitud(id);
  };

  rechazar = async (id: string) => {
    await this.repo.rechazarSolicitud(id);
  };
}
