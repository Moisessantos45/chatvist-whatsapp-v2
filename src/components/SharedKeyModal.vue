<template>
    <div class="bg-[#1a1d24] border border-gray-800 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.5)] w-full max-w-sm p-8 transform transition-all">
        <div v-if="!isLoading && codeCluster" class="text-center">
            <div
                class="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-5 border border-transparent">
                <Share2 class="w-6 h-6 text-gray-300" />
            </div>
            <h3 class="text-xl font-bold text-gray-100 mb-2">Clave del Grupo</h3>
            <p class="text-sm text-gray-400 mb-6">Comparte esta clave para que otros se unan al grupo</p>

            <!-- Clave del grupo -->
            <div
                class="bg-[#13151a] rounded-xl p-5 mb-8 flex flex-col items-center gap-4 border border-gray-800 shadow-inner">
                <div class="p-2 bg-white rounded-lg shadow-sm border border-gray-100">
                    <QrcodeVue :value="urlInvite" :size="140" />
                </div>
                <RouterLink :to="{ name: 'JoinGroup', params: { clave: codeCluster } }" target="_blank"
                    class="text-whatsapp-medium-blue hover:text-whatsapp-light font-medium text-sm transition-colors">
                    Unirse a través de enlace
                </RouterLink>

                <div class="w-full h-px bg-gray-800 my-1"></div>

                <div
                    class="flex items-center justify-between w-full bg-[#1e2128] px-3 py-2.5 rounded-lg border border-gray-700/50 shadow-sm">
                    <span class="font-mono text-[15px] font-semibold text-gray-200 tracking-wider">{{
                        codeCluster }}</span>
                    <button @click="copyToClipboard"
                        class="p-1.5 rounded-md hover:bg-white/10 text-gray-400 hover:text-whatsapp-light transition-colors group"
                        title="Copiar clave">
                        <Copy class="w-4 h-4 group-active:scale-90 transition-transform" />
                    </button>
                </div>
            </div>

            <!-- Botones -->
            <div class="flex space-x-3">
                <button @click="showShareModal = false"
                    class="flex-1 px-4 py-2.5 bg-[#242830] border border-gray-700 text-gray-200 font-medium rounded-xl hover:bg-[#2a2f38] transition-colors shadow-sm active:scale-[0.98]">
                    Cerrar
                </button>
            </div>
        </div>
        <div v-else class="flex flex-col items-center justify-center py-10">
            <div
                class="w-12 h-12 rounded-full border-2 border-gray-700 border-t-whatsapp-medium-blue animate-spin mb-4">
            </div>
            <p class="text-sm text-gray-400 font-medium">Generando...</p>
        </div>
    </div>
</template>

<script setup lang="ts">
import { Share2, Copy } from 'lucide-vue-next'
import QrcodeVue from 'qrcode.vue'
import { storeToRefs } from 'pinia'
import useClusterStore from '@/stores/cluster'
import notification from '@/service/notification'

const clusterStore = useClusterStore()
const { codeCluster, urlInvite, isLoading, showShareModal } = storeToRefs(clusterStore);

const copyToClipboard = async () => {
    try {
        await navigator.clipboard.writeText(codeCluster.value)
        notification('Clave copiada al portapapeles', 'success')
    } catch (err) {
        console.error('Error al copiar:', err)
    }
}

</script>
