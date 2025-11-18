export type EstadoSolicitud = "pendiente" | "aprobada" | "rechazada";

export interface Solicitud {
  solicitudid: string;
  usuarioid: string;
  planid: string;
  estado: EstadoSolicitud;
  created_at: string;
}
