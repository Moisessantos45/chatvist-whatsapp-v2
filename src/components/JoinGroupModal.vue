<template>
  <!-- Overlay del modal -->
  <div class="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-50 flex items-center justify-center p-4 transition-opacity" @click="$emit('close')">
    <!-- Contenido del modal -->
    <div class="bg-[#1a1d24] border border-gray-800 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.5)] p-8 w-full max-w-[400px] transform transition-all"
      @click.stop>
      <!-- Header -->
      <div class="text-center mb-8">
        <div
          class="w-14 h-14 bg-white/5 border border-transparent rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-sm">
          <Users class="w-7 h-7 text-whatsapp-dark-blue" stroke-width="1.5" />
        </div>
        <h2 class="text-2xl font-bold text-gray-100 tracking-tight">Unirse a Grupo</h2>
        <p class="text-sm text-gray-400 mt-2">Ingresa la clave para acceder al chat</p>
      </div>

      <!-- Formulario -->
      <form @submit.prevent="handleSubmit">
        <div class="mb-8">
          <label for="groupCode" class="block text-[13px] font-semibold text-gray-300 mb-2 uppercase tracking-wide">
            Clave del Grupo
          </label>
          <div class="relative">
            <input id="groupCode" v-model="groupCode" type="text" placeholder="Ej: ABC123XYZ"
              class="w-full px-4 py-3.5 bg-[#13151a] border border-gray-700/50 rounded-xl focus:bg-[#1e2128] focus:border-whatsapp-dark-blue focus:ring-1 focus:ring-whatsapp-dark-blue transition-all duration-200 text-center text-lg font-mono tracking-wider placeholder-gray-500 text-gray-100"
              :class="{ 'border-red-500/50 bg-red-500/10 focus:border-red-500 focus:ring-red-500 focus:bg-[#1e2128]': hasError }" required />
            <div v-if="hasError" class="absolute right-3 top-1/2 transform -translate-y-1/2">
              <AlertCircle class="w-5 h-5 text-red-500" />
            </div>
          </div>
          <p v-if="hasError" class="text-red-500 text-[13px] font-medium mt-2 flex items-center justify-center">
            <AlertCircle class="w-4 h-4 mr-1.5" />
            {{ errorMessage }}
          </p>
        </div>

        <!-- Botones -->
        <div class="flex space-x-3">
          <button type="button" @click="$emit('close')"
            class="flex-1 px-4 py-3.5 bg-[#242830] border border-gray-700 hover:bg-[#2a2f38] rounded-xl text-gray-200 font-semibold transition-all duration-200 shadow-sm active:scale-[0.98]">
            Cancelar
          </button>
          <button type="submit" :disabled="!groupCode.trim() || isLoading"
            class="flex-1 px-4 py-3.5 bg-whatsapp-dark-blue hover:bg-whatsapp-dark-blue/90 rounded-xl text-white font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_4px_14px_0_rgb(0,0,0,0.2)] active:scale-[0.98] flex items-center justify-center">
            <span v-if="!isLoading">Unirse</span>
            <div v-else class="flex items-center">
              <div class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
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
