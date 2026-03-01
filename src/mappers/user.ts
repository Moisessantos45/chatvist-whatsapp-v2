import type { User } from "@/types/user";

const mapToJsonEntityUser = (data: { [key: string]: any }): User => {
  const rawFecha = data["fecha"];
  const parsedFecha = rawFecha ? new Date(rawFecha) : new Date();

  return {
    id: Number(data["id"]) || 0,
    nombre: data["nombre"]?.toString() ?? "",
    apodo: data["apodo"]?.toString() ?? "",
    email: data["email"]?.toString() ?? "",
    password: data["password"]?.toString() ?? "",
    fecha: isNaN(parsedFecha.getTime()) ? new Date() : parsedFecha,
    token: data["token"] ?? data["Token"] ?? "",
    isAdmin: data["isAdmin"] ?? data["IsAdmin"]?.toString() === "true",
    isActive: data["isActive"] ?? data["IsActive"]?.toString() === "true",
    isLlm: data["isLlm"] ?? data["IsLlm"]?.toString() === "true",
    grupos: data["grupos"] ?? data["Grupos"] ?? [],
    mensajes: data["mensajes"] ?? data["Mensajes"] ?? [],
  };
};

export { mapToJsonEntityUser };
