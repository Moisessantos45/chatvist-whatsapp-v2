import { ref } from "vue";
import { defineStore, storeToRefs } from "pinia";
import axios from "axios";
import type { Cluster } from "@/types/cluster";
import { initializedClusterState } from "@/types/cluster";
import useUserStore from "./user";
import { mapToJsonEntityCluster } from "../mappers/cluster";
import notification from "@/service/notification";
import useMessageStore from "./message";

const useClusterStore = defineStore("cluster", () => {
  const api = import.meta.env.VITE_HOST_API;
  const cluster = ref<Cluster>({ ...initializedClusterState });
  const clusters = ref<Cluster[]>([]);
  const codeCluster = ref<string>("");
  const urlInvite = ref<string>("");
  const isLoading = ref<boolean>(false);
  // Estado reactivo
  const showShareModal = ref(false);

  const { user } = storeToRefs(useUserStore());
  const { currentCluster } = storeToRefs(useMessageStore());

  const getAllClustersUser = async () => {
    try {
      const { data } = await axios.get(
        `${api}/api/group/user/${user.value.id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("bearerToken")}`,
          },
        },
      );

      if (!data?.data) return;

      clusters.value = data.data.map(mapToJsonEntityCluster);
    } catch (error) {
      notification("Error al obtener clusters", "error");
    }
  };

  const generateClusterCode = async () => {
    try {
      if (currentCluster.value < 1) return;

      isLoading.value = true;
      codeCluster.value = "";
      showShareModal.value = true;
      const { data } = await axios.post(
        `${api}/api/group/generate-code/${currentCluster.value}`,
        null,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("bearerToken")}`,
          },
        },
      );

      console.log("Generate cluster code success:", data);
      if (!data?.data) return;

      codeCluster.value = data.data["clave"];
      urlInvite.value = data.data["url"];
    } catch (error) {
      console.log("Generate cluster code error:", error);
      notification("Error al generar clave", "error");
      showShareModal.value = false;
    } finally {
      isLoading.value = false;

    }
  };

  const resetClusterStore = () => {
    cluster.value = { ...initializedClusterState };
  };

  return {
    cluster,
    clusters,
    getAllClustersUser,
    resetClusterStore,
    generateClusterCode,
    codeCluster,
    urlInvite,
    isLoading,
    showShareModal,
  };
});

export default useClusterStore;
