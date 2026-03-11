<template>
    <div v-if="show"
        class="fixed inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center z-50 p-4 transition-opacity"
        @click.self="$emit('close')">
        <div class="bg-[#1a1d24] rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.5)] border border-gray-800 w-full max-w-md transform transition-all">
            <!-- Header del modal -->
            <div class="px-6 py-5 border-b border-gray-800">
                <div class="flex items-center justify-between">
                    <h3 class="text-lg font-semibold text-gray-100">Opciones del Chat</h3>
                    <button @click="$emit('close')"
                        class="p-1.5 rounded-md hover:bg-white/10 transition-colors text-gray-400 hover:text-white">
                        <X class="w-5 h-5" />
                    </button>
                </div>
            </div>

            <!-- Lista de opciones -->
            <div class="py-2 flex flex-col">
                <!-- Compartir clave de grupo -->
                <button @click="handleShareGroupCode"
                    class="w-full px-6 py-3.5 flex items-center hover:bg-white/5 transition-colors text-left group">
                    <div
                        class="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center mr-4 group-hover:bg-white/10 group-hover:shadow-sm border border-transparent transition-all">
                        <Share2 class="w-5 h-5 text-gray-300" />
                    </div>
                    <div>
                        <h4 class="font-medium text-gray-100">Compartir clave de grupo</h4>
                        <p class="text-[13px] text-gray-400">Comparte la clave para que otros se unan</p>
                    </div>
                </button>

                <!-- Agregar nuevo integrante -->
                <button @click="handleAddMember"
                    class="w-full px-6 py-3.5 flex items-center hover:bg-white/5 transition-colors text-left group">
                    <div
                        class="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center mr-4 group-hover:bg-white/10 group-hover:shadow-sm border border-transparent transition-all">
                        <UserPlus class="w-5 h-5 text-gray-300" />
                    </div>
                    <div>
                        <h4 class="font-medium text-gray-100">Agregar nuevo integrante</h4>
                        <p class="text-[13px] text-gray-400">Invita a más personas al grupo</p>
                    </div>
                </button>

                <!-- Si el usuario es admin permitir descargar los mensajes del grupo -->
                <button v-if="user.isAdmin" @click="openDownloadModal"
                    class="w-full px-6 py-3.5 flex items-center hover:bg-white/5 transition-colors text-left group">
                    <div
                        class="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center mr-4 group-hover:bg-white/10 group-hover:shadow-sm border border-transparent transition-all">
                        <Download class="w-5 h-5 text-gray-300" />
                    </div>
                    <div>
                        <h4 class="font-medium text-gray-100">Descargar mensajes</h4>
                        <p class="text-[13px] text-gray-400">Descargar los mensajes del grupo</p>
                    </div>
                </button>


                <!-- Ver información -->
                <button @click="handleViewInfo"
                    class="w-full px-6 py-3.5 flex items-center hover:bg-white/5 transition-colors text-left group">
                    <div
                        class="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center mr-4 group-hover:bg-white/10 group-hover:shadow-sm border border-transparent transition-all">
                        <Info class="w-5 h-5 text-gray-300" />
                    </div>
                    <div>
                        <h4 class="font-medium text-gray-100">Ver información</h4>
                        <p class="text-[13px] text-gray-400">Detalles del grupo y miembros</p>
                    </div>
                </button>
            </div>
        </div>

        <!-- Modal para compartir clave -->
        <div v-if="showShareModal"
            class="fixed inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center z-[60] p-4 transition-opacity"
            @click.self="showShareModal = false">
            <SharedKeyModal />
        </div>

        <!-- Modal para descargar los mensajes con filtro de fechas -->
        <div v-if="showDownloadModal"
            class="fixed inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center z-[60] p-4 transition-opacity"
            @click.self="showDownloadModal = false">
            <div class="bg-[#1a1d24] border border-gray-800 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.5)] w-full max-w-sm p-8 transform transition-all">
                <div class="text-center mb-6">
                    <div class="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-5 border border-transparent">
                        <Download class="w-6 h-6 text-gray-300" />
                    </div>
                    <h3 class="text-xl font-bold text-gray-100 mb-2">Descargar Mensajes</h3>
                    <p class="text-sm text-gray-400">Filtra los mensajes por fecha (Opcional)</p>
                </div>

                <div class="space-y-4 mb-8">
                    <div>
                        <label class="block text-[13px] font-semibold text-gray-300 mb-1.5 uppercase tracking-wide">Fecha Inicio</label>
                        <input type="date" v-model="startDate" 
                            class="w-full px-4 py-3 bg-[#13151a] border border-gray-700/50 rounded-xl focus:bg-[#1e2128] focus:border-whatsapp-dark-blue focus:ring-1 focus:ring-whatsapp-dark-blue transition-all duration-200 text-gray-100 placeholder-gray-500 color-scheme-dark" />
                    </div>
                    <div>
                        <label class="block text-[13px] font-semibold text-gray-300 mb-1.5 uppercase tracking-wide">Fecha Fin</label>
                        <input type="date" v-model="endDate" 
                            class="w-full px-4 py-3 bg-[#13151a] border border-gray-700/50 rounded-xl focus:bg-[#1e2128] focus:border-whatsapp-dark-blue focus:ring-1 focus:ring-whatsapp-dark-blue transition-all duration-200 text-gray-100 placeholder-gray-500 color-scheme-dark" />
                    </div>
                </div>

                <div class="flex space-x-3">
                    <button @click="showDownloadModal = false"
                        class="flex-1 px-4 py-2.5 bg-[#242830] border border-gray-700 text-gray-200 font-medium rounded-xl hover:bg-[#2a2f38] transition-colors shadow-sm active:scale-[0.98]">
                        Cancelar
                    </button>
                    <button @click="downloadDataGroup" :disabled="isDownloading"
                        class="flex-1 px-4 py-2.5 bg-whatsapp-dark-blue hover:bg-whatsapp-dark-blue/90 text-white font-medium rounded-xl transition-colors shadow-[0_4px_14px_0_rgb(0,0,0,0.2)] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center">
                        <div v-if="isDownloading" class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                        Descargar
                    </button>
                </div>
            </div>
        </div>

    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { X, Share2, UserPlus, Info, Download } from 'lucide-vue-next'
import { storeToRefs } from 'pinia'
import SharedKeyModal from './SharedKeyModal.vue'
import useUserStore from '@/stores/user'
import useClusterStore from '@/stores/cluster'
import useMessageStore from '@/stores/message'
import notification from '@/service/notification'

interface Props {
    show: boolean
    groupCode: string
    groupName: string
}

defineProps<Props>()

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const clusterStore = useClusterStore()
const { showShareModal } = storeToRefs(clusterStore);

const messageStore = useMessageStore()


defineEmits<{
    close: []
    shareGroupCode: []
    addMember: []
    viewInfo: []
}>()

const showDownloadModal = ref(false)
const startDate = ref('')
const endDate = ref('')
const isDownloading = ref(false)

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

const openDownloadModal = () => {
    startDate.value = ''
    endDate.value = ''
    showDownloadModal.value = true
}

const downloadDataGroup = async () => {
    try {
        isDownloading.value = true
        await messageStore.exportarJSON(startDate.value, endDate.value);
        notification('Datos descargados correctamente', 'success')
        showDownloadModal.value = false
    } catch (e) {
        notification('Error al descargar los datos', 'error')
    } finally {
        isDownloading.value = false
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
