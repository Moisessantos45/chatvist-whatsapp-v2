<template>
  <div
    class="min-h-screen bg-gradient-to-br from-whatsapp-dark-blue to-whatsapp-sky-blue flex items-center justify-center p-4">
    <div
      class="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md transform transition-all duration-300 hover:scale-105">
      <div class="text-center mb-8">
        <div
          class="w-20 h-20 bg-gradient-to-r from-whatsapp-dark-blue to-whatsapp-sky-blue rounded-full mx-auto mb-4 flex items-center justify-center">
          <svg class="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
          </svg>
        </div>
        <h1 class="text-3xl font-bold text-gray-800 mb-2">Bienvenido a Chatvist</h1>
        <p class="text-whatsapp-gray">Inicia sesión para continuar en WhatsApp Web</p>
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-6">
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Ingresa tu correo electrónico
            </label>
            <input v-model="email" type="text" required
              class="w-full px-4 py-3 rounded-lg border border-whatsapp-light-gray focus:ring-2 focus:ring-whatsapp-medium-blue focus:border-transparent transition-all duration-200"
              placeholder="Enter your username">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <input v-model="password" type="password" required
              class="w-full px-4 py-3 rounded-lg border border-whatsapp-light-gray focus:ring-2 focus:ring-whatsapp-medium-blue focus:border-transparent transition-all duration-200"
              placeholder="Enter your password">
          </div>
        </div>

        <button type="submit"
          class="w-full py-3 bg-gradient-to-r from-whatsapp-dark-blue to-whatsapp-sky-blue text-white rounded-lg font-semibold hover:from-whatsapp-sky-blue hover:to-whatsapp-dark-blue transition-all duration-300 transform hover:scale-105 shadow-lg">
          Login
        </button>
      </form>

      <div class="text-center mt-6">
        <p class="text-whatsapp-gray">
          Don't have an account?
          <RouterLink :to="{ name: 'Register' }"
            class="text-whatsapp-medium-blue hover:text-whatsapp-dark-blue font-semibold transition-colors duration-200">
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
