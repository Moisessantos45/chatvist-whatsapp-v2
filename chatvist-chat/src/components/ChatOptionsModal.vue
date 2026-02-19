<template>
    <div v-if="show" class="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50 p-4"
        @click.self="$emit('close')">
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all duration-300 scale-100">
            <!-- Header del modal -->
            <div class="px-6 py-4 border-b border-gray-200">
                <div class="flex items-center justify-between">
                    <h3 class="text-lg font-semibold text-gray-900">Opciones del Chat</h3>
                    <button @click="$emit('close')" class="p-2 rounded-full hover:bg-gray-100 transition-colors">
                        <X class="w-5 h-5 text-gray-500" />
                    </button>
                </div>
            </div>

            <!-- Lista de opciones -->
            <div class="py-2">
                <!-- Compartir clave de grupo -->
                <button @click="handleShareGroupCode"
                    class="w-full px-6 py-4 flex items-center hover:bg-gray-50 transition-colors text-left">
                    <div class="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                        <Share2 class="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                        <h4 class="font-medium text-gray-900">Compartir clave de grupo</h4>
                        <p class="text-sm text-gray-500">Comparte la clave para que otros se unan</p>
                    </div>
                </button>

                <!-- Agregar nuevo integrante -->
                <button @click="handleAddMember"
                    class="w-full px-6 py-4 flex items-center hover:bg-gray-50 transition-colors text-left">
                    <div class="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-4">
                        <UserPlus class="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                        <h4 class="font-medium text-gray-900">Agregar nuevo integrante</h4>
                        <p class="text-sm text-gray-500">Invita a más personas al grupo</p>
                    </div>
                </button>

                <!-- Ver información -->
                <button @click="handleViewInfo"
                    class="w-full px-6 py-4 flex items-center hover:bg-gray-50 transition-colors text-left">
                    <div class="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mr-4">
                        <Info class="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                        <h4 class="font-medium text-gray-900">Ver información</h4>
                        <p class="text-sm text-gray-500">Detalles del grupo y miembros</p>
                    </div>
                </button>
            </div>
        </div>

        <!-- Modal para compartir clave -->
        <div v-if="showShareModal"
            class="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-60 p-4"
            @click.self="showShareModal = false">
            <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
                <div class="text-center">
                    <div class="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
                        <Share2 class="w-8 h-8 text-blue-600" />
                    </div>
                    <h3 class="text-lg font-semibold text-gray-900 mb-2">Clave del Grupo</h3>
                    <p class="text-sm text-gray-500 mb-6">Comparte esta clave para que otros se unan al grupo</p>

                    <!-- Clave del grupo -->
                    <div class="bg-gray-50 rounded-lg p-4 mb-6">
                        <div class="flex items-center justify-between">
                            <span class="font-mono text-lg font-semibold text-gray-900">{{ groupCode }}</span>
                            <button @click="copyToClipboard"
                                class="p-2 rounded-lg bg-blue-100 hover:bg-blue-200 transition-colors">
                                <Copy class="w-4 h-4 text-blue-600" />
                            </button>
                        </div>
                    </div>

                    <!-- Botones -->
                    <div class="flex space-x-3">
                        <button @click="showShareModal = false"
                            class="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                            Cerrar
                        </button>
                        <button @click="shareGroupCode"
                            class="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                            Compartir
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { X, Share2, UserPlus, Info, Copy } from 'lucide-vue-next'
import notification from '@/service/notification'

interface Props {
    show: boolean
    groupCode: string
    groupName: string
}

const props = defineProps<Props>()

defineEmits<{
    close: []
    shareGroupCode: []
    addMember: []
    viewInfo: []
}>()

// Estado reactivo
const showShareModal = ref(false)

// Métodos
const handleShareGroupCode = () => {
    showShareModal.value = true
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
        await navigator.clipboard.writeText(props.groupCode)
        notification('Clave copiada al portapapeles', 'success')
    } catch (err) {
        console.error('Error al copiar:', err)
    }
}

const shareGroupCode = () => {
    if (navigator.share) {
        navigator.share({
            title: `Únete al grupo ${props.groupName}`,
            text: `Clave del grupo: ${props.groupCode}`,
            url: window.location.href
        })
    } else {
        // Fallback: copiar al portapapeles
        copyToClipboard()
    }
    showShareModal.value = false
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
