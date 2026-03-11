<template>
    <div v-if="show" class="fixed inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center z-50 p-4 transition-opacity"
        @click.self="$emit('close')">
        <div class="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] w-full max-w-md transform transition-all">
            <!-- Header del modal -->
            <div class="px-6 py-5 border-b border-gray-100">
                <div class="flex items-center justify-between">
                    <h3 class="text-lg font-semibold text-gray-900">Opciones del Chat</h3>
                    <button @click="$emit('close')" class="p-1.5 rounded-md hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-600">
                        <X class="w-5 h-5" />
                    </button>
                </div>
            </div>

            <!-- Lista de opciones -->
            <div class="py-2 flex flex-col">
                <!-- Compartir clave de grupo -->
                <button @click="handleShareGroupCode"
                    class="w-full px-6 py-3.5 flex items-center hover:bg-gray-50 transition-colors text-left group">
                    <div class="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mr-4 group-hover:bg-white group-hover:shadow-sm border border-transparent group-hover:border-gray-200 transition-all">
                        <Share2 class="w-5 h-5 text-gray-600" />
                    </div>
                    <div>
                        <h4 class="font-medium text-gray-900">Compartir clave de grupo</h4>
                        <p class="text-[13px] text-gray-500">Comparte la clave para que otros se unan</p>
                    </div>
                </button>

                <!-- Agregar nuevo integrante -->
                <button @click="handleAddMember"
                    class="w-full px-6 py-3.5 flex items-center hover:bg-gray-50 transition-colors text-left group">
                    <div class="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mr-4 group-hover:bg-white group-hover:shadow-sm border border-transparent group-hover:border-gray-200 transition-all">
                        <UserPlus class="w-5 h-5 text-gray-600" />
                    </div>
                    <div>
                        <h4 class="font-medium text-gray-900">Agregar nuevo integrante</h4>
                        <p class="text-[13px] text-gray-500">Invita a más personas al grupo</p>
                    </div>
                </button>

                <!-- Ver información -->
                <button @click="handleViewInfo"
                    class="w-full px-6 py-3.5 flex items-center hover:bg-gray-50 transition-colors text-left group">
                    <div class="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mr-4 group-hover:bg-white group-hover:shadow-sm border border-transparent group-hover:border-gray-200 transition-all">
                        <Info class="w-5 h-5 text-gray-600" />
                    </div>
                    <div>
                        <h4 class="font-medium text-gray-900">Ver información</h4>
                        <p class="text-[13px] text-gray-500">Detalles del grupo y miembros</p>
                    </div>
                </button>
            </div>
        </div>

        <!-- Modal para compartir clave -->
        <div v-if="showShareModal"
            class="fixed inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center z-[60] p-4 transition-opacity"
            @click.self="showShareModal = false">
            <div class="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] w-full max-w-sm p-8 transform transition-all">
                <div v-if="!isLoading && codeCluster" class="text-center">
                    <div class="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-5 border border-gray-200">
                        <Share2 class="w-6 h-6 text-gray-700" />
                    </div>
                    <h3 class="text-xl font-bold text-gray-900 mb-2">Clave del Grupo</h3>
                    <p class="text-sm text-gray-500 mb-6">Comparte esta clave para que otros se unan al grupo</p>

                    <!-- Clave del grupo -->
                    <div class="bg-gray-50 rounded-xl p-5 mb-8 flex flex-col items-center gap-4 border border-gray-200/60 shadow-inner">
                        <div class="p-2 bg-white rounded-lg shadow-sm border border-gray-100">
                            <QrcodeVue :value="urlInvite" :size="140" />
                        </div>
                        <RouterLink :to="{ name: 'JoinGroup', params: { clave: codeCluster } }" target="_blank"
                            class="text-whatsapp-medium-blue hover:text-whatsapp-dark-blue font-medium text-sm transition-colors"> Unirse a través de enlace
                        </RouterLink>
                        
                        <div class="w-full h-px bg-gray-200/60 my-1"></div>

                        <div class="flex items-center justify-between w-full bg-white px-3 py-2.5 rounded-lg border border-gray-200 shadow-sm">
                            <span class="font-mono text-[15px] font-semibold text-gray-800 tracking-wider">{{ codeCluster }}</span>
                            <button @click="copyToClipboard"
                                class="p-1.5 rounded-md hover:bg-gray-100 text-gray-500 hover:text-whatsapp-dark-blue transition-colors group" title="Copiar clave">
                                <Copy class="w-4 h-4 group-active:scale-90 transition-transform" />
                            </button>
                        </div>
                    </div>

                    <!-- Botones -->
                    <div class="flex space-x-3">
                        <button @click="showShareModal = false"
                            class="flex-1 px-4 py-2.5 bg-white border border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors shadow-sm active:scale-[0.98]">
                            Cerrar
                        </button>
                    </div>
                </div>
                <div v-else class="flex flex-col items-center justify-center py-10">
                    <div class="w-12 h-12 rounded-full border-2 border-gray-200 border-t-whatsapp-medium-blue animate-spin mb-4"></div>
                    <p class="text-sm text-gray-500 font-medium">Generando...</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { X, Share2, UserPlus, Info, Copy } from 'lucide-vue-next'
import QrcodeVue from 'qrcode.vue'
import { storeToRefs } from 'pinia'
import useClusterStore from '@/stores/cluster'
import notification from '@/service/notification'

interface Props {
    show: boolean
    groupCode: string
    groupName: string
}

defineProps<Props>()
const clusterStore = useClusterStore()
const { codeCluster, urlInvite, isLoading, showShareModal } = storeToRefs(clusterStore);

defineEmits<{
    close: []
    shareGroupCode: []
    addMember: []
    viewInfo: []
}>()

// Métodos
const handleShareGroupCode = () => {
    clusterStore.generateClusterCode()
}

const handleAddMember = () => {
    // Emitir evento para agregar miembro
    console.log('Agregar nuevo integrante')
    // Aquí puedes emitir un evento o abrir otro modal
}

const handleViewInfo = () => {
    // Emitir evento para ver información
    console.log('Ver información del grupo')
    // Aquí puedes emitir un evento o abrir otro modal
}

const copyToClipboard = async () => {
    try {
        await navigator.clipboard.writeText(codeCluster.value)
        notification('Clave copiada al portapapeles', 'success')
    } catch (err) {
        console.error('Error al copiar:', err)
    }
}
</script>

<style scoped>
/* Animaciones de entrada */
@keyframes modalEnter {
    from {
        opacity: 0;
        transform: scale(0.95);
    }

    to {
        opacity: 1;
        transform: scale(1);
    }
}

.scale-100 {
    animation: modalEnter 0.3s ease-out;
}

/* Z-index personalizado */
.z-60 {
    z-index: 60;
}
</style>
