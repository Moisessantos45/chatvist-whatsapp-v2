import { ref } from "vue";
import { defineStore } from "pinia";
import axios from "axios";
import { initializedUserState, type User } from "@/types/user";
import { mapToJsonEntityUser } from "../mappers/user";
import notification from "@/service/notification";
import type { Message } from "@/types/message";

import router from "@/router/router";

const useUserStore = defineStore("user", () => {
  const api = import.meta.env.VITE_HOST_API;
  const user = ref<User>({ ...initializedUserState });
  const newUser = ref<User>({ ...initializedUserState });
  const users = ref<User[]>([]);

  // Variables para menciones
  const filteredUsers = ref<any[]>([]);
  const selectedMentionIndex = ref(0);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const { data } = await axios.post(`${api}/api/public/login`, {
        email,
        password,
      });
      user.value = mapToJsonEntityUser(data.data);
      const token = data.data.token ?? data.data.Token ?? "";
      localStorage.setItem("bearerToken", token);
      return true;
    } catch (error) {
      console.log("Login error:", error);
      notification(
        "Error al iniciar sesión. Verifica tus credenciales.",
        "error",
      );
      return false;
    }
  };

  const logout = async () => {
    try {
      await axios.post(
        `${api}/api/public/logout`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("bearerToken")}`,
          },
        },
      );
    } catch (error) {
      console.log("Logout error:", error);
    } finally {
      resetUser();
      localStorage.removeItem("bearerToken");
    }
  };

  const resetUser = () => {
    user.value = { ...initializedUserState };
  };

  const getUser = async () => {
    const token = localStorage.getItem("bearerToken");
    if (!token) {
      resetUser();
      router.push({ name: "Login" });
      return;
    }
    try {
      const { data } = await axios.get(`${api}/api/user/token`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Get user successful:", data.data);
      user.value = mapToJsonEntityUser(data.data);
    } catch (error) {
      console.log("Get user error:", error);
      resetUser();
      localStorage.removeItem("bearerToken");
      router.push({ name: "Login" });
    }
  };

  const register = async () => {
    try {
      const { nombre, apodo, email, password } = newUser.value;
      await axios.post(`${api}/api/public/register`, {
        nombre,
        apodo,
        email,
        password,
      });

      notification("Registro exitoso. Ahora puedes iniciar sesión.", "success");
      newUser.value = { ...initializedUserState };
      return true;
    } catch (error) {
      notification(
        "Error en el registro. Por favor, intenta nuevamente.",
        "error",
      );
      return false;
    }
  };

  // Función para obtener usuarios únicos del grupo desde los mensajes
  const getGroupUsers = (messages: Message[]) => {
    const usersMap = new Map();

    // Agregar el usuario actual de la sesión (solo si tiene nombre)
    if (user.value.nombre && user.value.nombre.trim()) {
      usersMap.set(user.value.id, {
        id: user.value.id,
        nombre: user.value.nombre,
      });
    }

    // Agregar todos los usuarios que han enviado mensajes (solo si tienen nombre)
    messages.forEach((msg) => {
      if (
        !usersMap.has(msg.usuarioId) &&
        msg.usuario.nombre &&
        msg.usuario.nombre.trim()
      ) {
        usersMap.set(msg.usuarioId, {
          id: msg.usuarioId,
          nombre: msg.usuario.nombre,
        });
      }
    });

    return Array.from(usersMap.values());
  };

  // Función para filtrar usuarios basado en búsqueda
  const updateFilteredUsers = (groupUsers: any[], mentionSearch: string) => {
    const search = mentionSearch.toLowerCase();
    filteredUsers.value = groupUsers.filter(
      (userItem: any) =>
        userItem.nombre &&
        userItem.nombre.trim() &&
        userItem.nombre.toLowerCase().includes(search),
    );
    selectedMentionIndex.value = 0;
  };

  // Función para navegar en la lista de menciones
  const navigateMentionList = (direction: "up" | "down") => {
    if (direction === "down") {
      selectedMentionIndex.value =
        (selectedMentionIndex.value + 1) % filteredUsers.value.length;
    } else {
      selectedMentionIndex.value =
        selectedMentionIndex.value > 0
          ? selectedMentionIndex.value - 1
          : filteredUsers.value.length - 1;
    }
  };

  // Función para obtener el usuario seleccionado
  const getSelectedMentionUser = () => {
    return filteredUsers.value[selectedMentionIndex.value];
  };

  return {
    user,
    newUser,
    users,
    filteredUsers,
    selectedMentionIndex,
    login,
    logout,
    resetUser,
    getUser,
    register,
    getGroupUsers,
    updateFilteredUsers,
    navigateMentionList,
    getSelectedMentionUser,
  };
});

export default useUserStore;
