import { ref } from "vue";
import { defineStore, storeToRefs } from "pinia";
import axios from "axios";
import type { Cluster } from "@/types/cluster";
import { initializedClusterState } from "@/types/cluster";
import useUserStore from "./user";
import { mapToJsonEntityCluster } from "../mappers/cluster";

const useClusterStore = defineStore("cluster", () => {
  const api = import.meta.env.VITE_HOST_API;
  const cluster = ref<Cluster>({ ...initializedClusterState });
  const clusters = ref<Cluster[]>([]);

  const { user } = storeToRefs(useUserStore());

  const getAllClustersUser = async () => {
    try {
      const { data } = await axios.get(
        `${api}/api/grupo/usuario/${user.value.id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("bearerToken")}`,
          },
        }
      );

      console.log("Get all clusters success:", data);

      clusters.value = data.data.map(mapToJsonEntityCluster);
    } catch (error) {
      console.log("Get all clusters error:", error);
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
  };
});

export default useClusterStore;
