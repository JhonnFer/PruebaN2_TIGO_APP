import { Solicitud, EstadoSolicitud } from "../models/Solicitud";

export interface SolicitudRepository {
  listarSolicitudes(): Promise<Solicitud[]>;
  aprobarSolicitud(id: string): Promise<void>;
  rechazarSolicitud(id: string): Promise<void>;
}
