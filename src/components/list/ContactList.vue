<template>
    <!-- Lista de contactos -->
    <div class="flex-1 overflow-y-auto w-full">
        <div v-for="contact in filteredContacts" :key="contact.id" @click="selectContact(contact)" :class="[
            'flex items-center px-5 py-3.5 cursor-pointer transition-colors w-full border-b border-gray-800/60 last:border-b-0',
            cluster?.id === contact.id ? 'bg-[#20232b]' : 'bg-transparent hover:bg-white/5'
        ]">
            <!-- Avatar -->
            <div class="relative mr-4 shrink-0">
                <div
                    class="w-12 h-12 rounded-full bg-whatsapp-medium-blue flex items-center justify-center text-white font-semibold text-lg">
                    {{ contact.nombre.charAt(0).toUpperCase() }}
                </div>
            </div>

            <!-- Información del contacto -->
            <div class="flex-1 min-w-0 border-b border-transparent">
                <div class="flex items-center justify-between mb-0.5">
                    <h3 class="font-medium text-gray-100 truncate text-base leading-tight">
                        {{ contact.nombre }}
                    </h3>
                    <span class="text-xs text-gray-500 font-medium shrink-0 ml-2">12:34</span>
                </div>
                <div class="flex items-center justify-between text-sm" v-if="contact.messages.length > 0">
                    <p class="text-gray-400 truncate leading-snug">{{ contact.messages[0].contenido }}</p>
                    <!-- <div v-if="contact.unreadCount > 0"
                        class="bg-whatsapp-light text-white text-[10px] font-bold rounded-full min-w-[20px] h-5 flex items-center justify-center px-1 shrink-0 ml-2">
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
const {currentCluster}=storeToRefs(messageStore);
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
    currentCluster.value = contact.id;
    await messageStore.getAllMessagesCluster(contact.id);
}

</script>