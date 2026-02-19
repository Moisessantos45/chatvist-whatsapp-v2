import type { Cluster } from "@/types/cluster";
import { mapToJsonEntityMessage } from "./message";

const mapToJsonEntityCluster = (data: { [key: string]: any }): Cluster => {
  return {
    id: data["id"] ?? 0,
    clave: data["clave"] ?? "",
    nombre: data["nombre"] ?? "",
    fecha: new Date(data["fecha"]) ?? new Date(),
    createdById: data["createdById"] ?? 0,
    messages: data["mensajes"]
      ? data["mensajes"].map(mapToJsonEntityMessage)
      : [],
  };
};

export { mapToJsonEntityCluster };
