<template>
    <div class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
        @click="$emit('close')">
        <div class="bg-white rounded-2xl shadow-2xl p-6 w-11/12 md:w-5/12 lg:w-4/12 transform transition-all duration-300 animate-modal-enter"
            @click.stop>
            <div class="text-center mb-6">
                <div
                    class="w-14 h-14 mx-auto mb-3 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                    <FolderPlus class="w-7 h-7 text-white" />
                </div>
                <h2 class="text-xl font-bold text-gray-800">Asignar a Grupo</h2>
                <p class="text-sm text-gray-500 mt-1">Selecciona un grupo para asignar al usuario</p>
            </div>

            <!-- Grupo seleccionado -->
            <div class="space-y-2 max-h-64 overflow-y-auto mb-6">
                <button v-for="g in groups" :key="g.id" @click="selectedGroupId = g.id"
                    class="w-full flex items-center gap-3 p-3 rounded-xl border-2 transition-all duration-150 cursor-pointer"
                    :class="selectedGroupId === g.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-100 hover:border-gray-200 hover:bg-gray-50'">
                    <div
                        class="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shrink-0">
                        <FolderClosed class="w-4 h-4 text-white" />
                    </div>
                    <div class="text-left min-w-0">
                        <p class="font-medium text-gray-800 text-sm truncate">{{ g.nombre }}</p>
                        <p class="text-xs text-gray-400 font-mono">{{ g.clave }}</p>
                    </div>
                    <div v-if="selectedGroupId === g.id" class="ml-auto">
                        <Check class="w-5 h-5 text-blue-500" />
                    </div>
                </button>

                <div v-if="groups.length === 0" class="py-8 text-center text-gray-400">
                    <FolderClosed class="w-8 h-8 mx-auto mb-2 opacity-40" />
                    <p class="text-sm">No hay grupos disponibles</p>
                </div>
            </div>

            <div class="flex gap-3">
                <button type="button" @click="$emit('close')"
                    class="flex-1 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 rounded-xl text-gray-700 font-medium transition-colors duration-200 cursor-pointer text-sm">
                    Cancelar
                </button>
                <button @click="handleAssign" :disabled="!selectedGroupId || submitting"
                    class="flex-1 px-4 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-xl text-white font-medium transition-all duration-200 cursor-pointer disabled:opacity-50 text-sm">
                    {{ submitting ? 'Asignando...' : 'Asignar' }}
                </button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { FolderPlus, FolderClosed, Check } from 'lucide-vue-next'
import type { Cluster } from '@/types/cluster'
import useAdminStore from '@/stores/admin'

const props = defineProps<{
    userId: number
    groups: Cluster[]
}>()

const emit = defineEmits<{
    close: []
}>()

const adminStore = useAdminStore()
const selectedGroupId = ref<number | null>(null)
const submitting = ref(false)

const handleAssign = async () => {
    if (!selectedGroupId.value) return
    submitting.value = true
    await adminStore.assignGroup(props.userId, selectedGroupId.value)
    submitting.value = false
    emit('close')
}
</script>

<style scoped>
@keyframes modal-enter {
    from {
        opacity: 0;
        transform: scale(0.95) translateY(10px);
    }

    to {
        opacity: 1;
        transform: scale(1) translateY(0);
    }
}

.animate-modal-enter {
    animation: modal-enter 0.2s ease-out;
}
</style>
