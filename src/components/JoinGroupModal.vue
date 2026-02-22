<template>
  <!-- Overlay del modal -->
  <div class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center" @click="$emit('close')">
    <!-- Contenido del modal -->
    <div class="bg-white rounded-2xl shadow-2xl p-8 w-96 max-w-[90vw] transform transition-all duration-300 scale-100"
      @click.stop>
      <!-- Header -->
      <div class="text-center mb-8">
        <div
          class="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <Users class="w-8 h-8 text-white" />
        </div>
        <h2 class="text-2xl font-bold text-gray-800">Unirse a Grupo</h2>
        <p class="text-gray-500 mt-2">Ingresa el código del grupo al que deseas unirte</p>
      </div>

      <!-- Formulario -->
      <form @submit.prevent="handleSubmit">
        <div class="mb-6">
          <label for="groupCode" class="block text-sm font-semibold text-gray-700 mb-3">
            Código del Grupo
          </label>
          <div class="relative">
            <input id="groupCode" v-model="groupCode" type="text" placeholder="Ej: ABC123XYZ"
              class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-0 focus:outline-none transition-all duration-200 text-center text-lg font-mono tracking-wider"
              :class="{ 'border-red-300 bg-red-50': hasError }" required />
            <div v-if="hasError" class="absolute right-3 top-1/2 transform -translate-y-1/2">
              <AlertCircle class="w-5 h-5 text-red-500" />
            </div>
          </div>
          <p v-if="hasError" class="text-red-500 text-sm mt-2 flex items-center">
            <AlertCircle class="w-4 h-4 mr-1" />
            {{ errorMessage }}
          </p>
          <p v-else class="text-gray-500 text-sm mt-2">
            El código debe ser proporcionado por el administrador del grupo
          </p>
        </div>

        <!-- Botones -->
        <div class="flex space-x-3">
          <button type="button" @click="$emit('close')"
            class="flex-1 px-4 py-3 bg-gray-200 hover:bg-gray-300 rounded-xl text-gray-700 font-semibold transition-all duration-200">
            Cancelar
          </button>
          <button type="submit" :disabled="!groupCode.trim() || isLoading"
            class="flex-1 px-4 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 rounded-xl text-white font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center">
            <span v-if="!isLoading">Unirse</span>
            <div v-else class="flex items-center">
              <div class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              Verificando...
            </div>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue'
import { Users, AlertCircle } from 'lucide-vue-next'
import useUserGroupStore from '@/stores/userGroup';
import notification from '@/service/notification';

const userGroupStore = useUserGroupStore()

defineEmits<{
  close: []
}>()

// Reactive data
const groupCode = ref('')
const isLoading = ref(false)
const hasError = ref(false)
const errorMessage = ref('')

// Methods
const handleSubmit = async () => {
  if (!groupCode.value.trim()) {
    notification('Por favor, ingresa un código de grupo válido', 'error')
    return
  }

  // Validación básica del formato
  if (groupCode.value.trim().length < 6) {
    notification('El código debe tener al menos 6 caracteres', 'error')
    return
  }


  isLoading.value = true
  hasError.value = false

  await userGroupStore.addUserToGroup(groupCode.value.trim())
  isLoading.value = false
}

// Auto-focus al input cuando se monta el componente
nextTick(() => {
  const input = document.getElementById('groupCode') as HTMLInputElement
  if (input) {
    input.focus()
  }
})
</script>

<style scoped>
/* Animación de entrada */
@keyframes modalEnter {
  from {
    opacity: 0;
    transform: scale(0.95) translateY(20px);
  }

  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.transform {
  animation: modalEnter 0.3s ease-out;
}

/* Animación del spinner */
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}

/* Efectos del input */
input:focus {
  box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.1);
}

/* Efecto de shake para errores */
.border-red-300 {
  animation: shake 0.3s ease-in-out;
}

@keyframes shake {

  0%,
  100% {
    transform: translateX(0);
  }

  25% {
    transform: translateX(-5px);
  }

  75% {
    transform: translateX(5px);
  }
}
</style>
