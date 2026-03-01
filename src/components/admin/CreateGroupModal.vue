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
                <h2 class="text-xl font-bold text-gray-800">Crear Grupo</h2>
                <p class="text-sm text-gray-500 mt-1">Crear un nuevo grupo de chat</p>
            </div>

            <form @submit.prevent="handleSubmit" class="space-y-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Nombre del grupo</label>
                    <input v-model="form.nombre" type="text" required placeholder="Ej: Grupo General"
                        class="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all duration-200 text-sm" />
                </div>

                <div class="flex gap-3 pt-2">
                    <button type="button" @click="$emit('close')"
                        class="flex-1 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 rounded-xl text-gray-700 font-medium transition-colors duration-200 cursor-pointer text-sm">
                        Cancelar
                    </button>
                    <button type="submit" :disabled="submitting"
                        class="flex-1 px-4 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-xl text-white font-medium transition-all duration-200 cursor-pointer disabled:opacity-50 text-sm">
                        {{ submitting ? 'Creando...' : 'Crear Grupo' }}
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { FolderPlus } from 'lucide-vue-next'
import useAdminStore from '@/stores/admin'
import useUserStore from '@/stores/user'

const emit = defineEmits<{
    close: []
}>()

const adminStore = useAdminStore()
const userStore = useUserStore()
const submitting = ref(false)

const form = ref({
    nombre: '',
})

const handleSubmit = async () => {
    submitting.value = true
    const success = await adminStore.createGroup({
        nombre: form.value.nombre,
        createdById: userStore.user.id,
    })
    submitting.value = false
    if (success) {
        emit('close')
    }
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
