import type { Message } from "@/types/message";
import { mapToJsonEntityUser } from "./user";
import { initializedUserState } from "@/types/user";

const mapToJsonEntityMessage = (data: { [key: string]: any }): Message => {
  return {
    id: data["id"] ?? 0,
    contenido: data["contenido"] ?? "",
    fecha: new Date(data["fecha"]) ?? new Date(),
    grupoId: data["grupoId"] ?? 0,
    usuarioId: data["usuarioId"] ?? 0,
    respuestaId: data["respuestaId"] ?? undefined,

    usuario: mapToJsonEntityUser(data["usuario"]) ?? {
      ...initializedUserState,
    },
  };
};

const mapToStringEntityMessage = (data: { [key: string]: any }): Message => {
  return {
    id: parseInt(data["Id"]) ?? 0,
    contenido: String(data["Content"]) ?? "",
    fecha: new Date(String(data["Fecha"])) ?? new Date(),
    grupoId: parseInt(data["GroupID"]) ?? 0,
    usuarioId: parseInt(data["SenderID"]) ?? 0,
    respuestaId: parseInt(data["AnswerId"]) ?? -1,

    usuario: { ...initializedUserState },
  };
};

export { mapToJsonEntityMessage, mapToStringEntityMessage };
