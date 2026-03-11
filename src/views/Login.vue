<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center p-4">
    <div class="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 p-8 w-full max-w-md">
      <div class="text-center mb-8">
        <div class="w-16 h-16 bg-whatsapp-dark-blue rounded-xl mx-auto mb-5 flex items-center justify-center shadow-sm">
          <svg class="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
          </svg>
        </div>
        <h1 class="text-2xl font-semibold text-gray-900 mb-1.5">Bienvenido a Chatvist</h1>
        <p class="text-sm text-gray-500">Inicia sesión para continuar en WhatsApp Web</p>
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-5">
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">
              Correo electrónico
            </label>
            <input v-model="email" type="email" required
              class="w-full px-3.5 py-2.5 bg-gray-50/50 rounded-lg border border-gray-200 text-gray-900 placeholder-gray-400 focus:bg-white focus:ring-2 focus:ring-whatsapp-dark-blue/20 focus:border-whatsapp-dark-blue transition-colors duration-200 outline-none"
              placeholder="Ingresa tu correo">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">Contraseña</label>
            <input v-model="password" type="password" required
              class="w-full px-3.5 py-2.5 bg-gray-50/50 rounded-lg border border-gray-200 text-gray-900 placeholder-gray-400 focus:bg-white focus:ring-2 focus:ring-whatsapp-dark-blue/20 focus:border-whatsapp-dark-blue transition-colors duration-200 outline-none"
              placeholder="Ingresa tu contraseña">
          </div>
        </div>

        <button type="submit"
          class="w-full py-2.5 bg-whatsapp-dark-blue hover:bg-whatsapp-dark-blue/90 text-white rounded-lg font-medium transition-colors duration-200 shadow-sm">
          Iniciar Sesión
        </button>
      </form>

      <div class="text-center mt-6">
        <p class="text-sm text-gray-500">
          ¿No tienes una cuenta?
          <RouterLink :to="{ name: 'Register' }"
            class="text-whatsapp-dark-blue hover:text-whatsapp-dark-blue/80 font-medium transition-colors duration-200">
            Registrarse
          </RouterLink>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import useUserStore from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()
const email = ref('')
const password = ref('')

const handleSubmit = async () => {
  const success = await userStore.login(email.value, password.value)
  if (success) {
    router.replace({ name: 'Dashboard' })
  }
}

</script>
