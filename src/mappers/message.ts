import type { Message } from "@/types/message";
import { mapToJsonEntityUser } from "./user";
import { initializedUserState } from "@/types/user";

const mapToJsonEntityMessage = (data: { [key: string]: any }): Message => {
  const rawFecha = data["fecha"];
  const parsedFecha = rawFecha ? new Date(rawFecha) : new Date();

  return {
    id: Number(data["id"]) || 0,
    contenido: data["contenido"]?.toString() ?? "",
    fecha: isNaN(parsedFecha.getTime()) ? new Date() : parsedFecha,
    grupoId: Number(data["grupoId"]) || 0,
    groupIdStr: data["groupIdStr"]?.toString() ?? undefined,
    usuarioId: Number(data["usuarioId"]) || 0,
    respuestaId:
      data["respuestaId"] != null ? Number(data["respuestaId"]) : undefined,
    senderName: data["senderName"]?.toString() ?? undefined,
    senderApodo: data["senderApodo"]?.toString() ?? undefined,

    usuario: data["usuario"]
      ? mapToJsonEntityUser(data["usuario"])
      : {
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
    groupIdStr: data["GroupID"] ? String(data["GroupID"]) : undefined,
    usuarioId: parseInt(data["SenderID"]) ?? 0,
    respuestaId: parseInt(data["AnswerId"]) ?? -1,
    senderName: data["SenderName"] ? String(data["SenderName"]) : undefined,
    senderApodo: data["SenderApodo"] ? String(data["SenderApodo"]) : undefined,

    usuario: { ...initializedUserState },
  };
};

export { mapToJsonEntityMessage, mapToStringEntityMessage };
