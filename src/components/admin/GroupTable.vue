<template>
    <div class="overflow-x-auto">
        <table class="w-full text-left">
            <thead>
                <tr class="border-b border-gray-200">
                    <th class="py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        ID
                    </th>
                    <th class="py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Nombre
                    </th>
                    <th class="py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Clave
                    </th>
                    <th class="py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Creado
                    </th>
                    <th class="py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Acciones
                    </th>
                </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
                <tr v-for="g in groups" :key="g.id" class="hover:bg-blue-50/50 transition-colors duration-150">
                    <td class="py-4 px-4 text-sm font-mono text-gray-500">{{ g.id }}</td>
                    <td class="py-4 px-4">
                        <div class="flex items-center gap-3">
                            <div
                                class="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                                <FolderClosed class="w-4 h-4 text-white" />
                            </div>
                            <span class="font-semibold text-gray-800">{{ g.nombre }}</span>
                        </div>
                    </td>
                    <td class="py-4 px-4">
                        <code
                            class="px-2 py-1 rounded-md bg-gray-100 text-xs font-mono text-gray-600 select-all">{{ g.clave }}</code>
                    </td>
                    <td class="py-4 px-4 text-sm text-gray-500">
                        {{ formatDate(g.fecha) }}
                    </td>
                    <td class="py-4 px-4">
                        <button
                            class="px-2 py-1 rounded-md bg-blue-500 text-white text-xs font-mono text-gray-600 select-all">
                            ver grupo
                        </button>
                    </td>
                </tr>
                <tr v-if="groups.length === 0">
                    <td colspan="4" class="py-12 text-center text-gray-400">
                        <FolderClosed class="w-10 h-10 mx-auto mb-2 opacity-40" />
                        <p>No hay grupos registrados</p>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script setup lang="ts">
import type { Cluster } from "@/types/cluster";
import { FolderClosed } from "lucide-vue-next";

defineProps<{
    groups: Cluster[];
}>();

const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("es-MX", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
};
</script>
