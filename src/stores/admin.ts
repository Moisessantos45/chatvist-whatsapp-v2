import { ref } from "vue";
import { defineStore } from "pinia";
import axios from "axios";
import type { User } from "@/types/user";
import type { Cluster } from "@/types/cluster";
import { mapToJsonEntityUser } from "@/mappers/user";
import { mapToJsonEntityCluster } from "@/mappers/cluster";
import notification from "@/service/notification";

const useAdminStore = defineStore("admin", () => {
  const api = import.meta.env.VITE_HOST_API;

  const users = ref<User[]>([]);
  const groups = ref<Cluster[]>([]);
  const loading = ref(false);

  const getHeaders = () => ({
    headers: {
      Authorization: `Bearer ${localStorage.getItem("bearerToken")}`,
    },
  });

  const fetchUsers = async () => {
    loading.value = true;
    try {
      const { data } = await axios.get(
        `${api}/api/admin/user`,
        getHeaders(),
      );
      users.value = (data.data ?? data).map(mapToJsonEntityUser);
    } catch (error) {
      console.error("Admin: Error fetching users:", error);
      notification("Error al obtener usuarios.", "error");
    } finally {
      loading.value = false;
    }
  };

  const fetchGroups = async () => {
    loading.value = true;
    try {
      const { data } = await axios.get(`${api}/api/admin/group`, getHeaders());
      groups.value = (data.data ?? data).map(mapToJsonEntityCluster);
    } catch (error) {
      console.error("Admin: Error fetching groups:", error);
      notification("Error al obtener grupos.", "error");
    } finally {
      loading.value = false;
    }
  };

  const registerAI = async (payload: {
    nombre: string;
    apodo: string;
    email: string;
    password: string;
  }) => {
    try {
      await axios.post(`${api}/api/admin/user`, payload, getHeaders());
      notification("IA registrada exitosamente.", "success");
      await fetchUsers();
      return true;
    } catch (error) {
      console.error("Admin: Error registering AI:", error);
      notification("Error al registrar IA.", "error");
      return false;
    }
  };

  const deactivateUser = async (userId: number) => {
    try {
      await axios.patch(
        `${api}/api/admin/user/${userId}/deactivate`,
        {},
        getHeaders(),
      );
      notification("Estado del usuario actualizado.", "success");
      await fetchUsers();
    } catch (error) {
      console.error("Admin: Error deactivating user:", error);
      notification("Error al cambiar estado del usuario.", "error");
    }
  };

  const removeSessions = async (userId: number) => {
    try {
      await axios.post(
        `${api}/api/admin/user/${userId}/remove-sessions`,
        {},
        getHeaders(),
      );
      notification("Sesiones eliminadas exitosamente.", "success");
    } catch (error) {
      console.error("Admin: Error removing sessions:", error);
      notification("Error al eliminar sesiones.", "error");
    }
  };

  const assignGroup = async (userId: number, grupoId: number) => {
    try {
      await axios.post(
        `${api}/api/admin/group/${userId}/user`,
        { grupoId },
        getHeaders(),
      );
      notification("Usuario asignado al grupo exitosamente.", "success");
    } catch (error) {
      console.error("Admin: Error assigning group:", error);
      notification("Error al asignar grupo.", "error");
    }
  };

  const createGroup = async (payload: {
    nombre: string;
    createdById: number;
  }) => {
    try {
      await axios.post(
        `${api}/api/group`,
        {
          nombre: payload.nombre,
          createdById: payload.createdById,
        },
        getHeaders(),
      );
      notification("Grupo creado exitosamente.", "success");
      await fetchGroups();
      return true;
    } catch (error) {
      console.error("Admin: Error creating group:", error);
      notification("Error al crear grupo.", "error");
      return false;
    }
  };

  return {
    users,
    groups,
    loading,
    fetchUsers,
    fetchGroups,
    registerAI,
    deactivateUser,
    removeSessions,
    assignGroup,
    createGroup,
  };
});

export default useAdminStore;
