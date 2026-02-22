<template>
    <!-- Lista de contactos -->
    <div class="flex-1 overflow-y-auto px-2 pt-2">
        <div v-for="contact in filteredContacts" :key="contact.id" @click="selectContact(contact)" :class="[
            'flex items-center p-4 mx-2 mb-2 hover:bg-blue-50 cursor-pointer transition-all duration-300 rounded-2xl group hover:shadow-md',
            cluster?.id === contact.id ? 'bg-blue-50 shadow-lg ring-2 ring-blue-200' : 'hover:transform hover:scale-[1.02]'
        ]">
            <!-- Avatar -->
            <div class="relative mr-4">
                <div
                    class="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                    {{ contact.nombre.charAt(0).toUpperCase() }}
                </div>

            </div>

            <!-- Información del contacto -->
            <div class="flex-1 min-w-0">
                <div class="flex items-center justify-between mb-2">
                    <h3
                        class="font-semibold text-gray-800 truncate text-lg group-hover:text-blue-700 transition-colors">
                        {{
                            contact.nombre }}</h3>
                    <span class="text-sm text-gray-500 font-medium">{{ contact.nombre }}</span>
                </div>
                <div class="flex items-center justify-between" v-if="contact.messages.length > 0">
                    <p class="text-gray-600 truncate">{{ contact.messages[0].contenido }}</p>
                    <!-- <div v-if="contact.unreadCount > 0"
                        class="bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm rounded-full px-3 py-1 min-w-[24px] text-center font-semibold shadow-lg">
                        {{ contact.unreadCount }}
                    </div> -->
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import useClusterStore from '@/stores/cluster';
import useMessageStore from '@/stores/message';
import type { Cluster } from '@/types/cluster';

const clusterStore = useClusterStore();
const messageStore = useMessageStore();
const { clusters, cluster } = storeToRefs(clusterStore);

const props = defineProps<{
    searchQuery: string;
}>()

// Computed
const filteredContacts = computed(() => {
    if (!props.searchQuery) return clusters.value;
    return clusters.value.filter(contact =>
        contact.nombre.toLowerCase().includes(props.searchQuery.toLowerCase())
    )
})


const selectContact = async (contact: Cluster) => {
    cluster.value = { ...contact };
    await messageStore.getAllMessagesCluster(contact.id);
}

</script>