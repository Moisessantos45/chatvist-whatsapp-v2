<template>
  <div class="min-h-screen bg-gradient-to-br from-whatsapp-dark-blue to-whatsapp-sky-blue overflow-hidden relative">
    <!-- Decorative subtle background pattern -->
    <div class="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:20px_20px]"></div>
    
    <!-- Hero Section -->
    <div class="container mx-auto px-6 py-20 relative z-10 flex flex-col items-center min-h-screen justify-center">
      <div class="text-center w-full max-w-3xl mx-auto">
        <div class="flex justify-center mb-8">
          <div class="p-5 bg-white/10 backdrop-blur-md rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-white/20">
            <MessageCircle class="h-12 w-12 text-white" stroke-width="1.5" />
          </div>
        </div>
        
        <h1 class="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6 tracking-tight leading-tight">
          La comunicación, <br class="hidden sm:block" />
          <span class="text-whatsapp-light">simple y segura.</span>
        </h1>
        
        <p class="text-lg sm:text-xl text-blue-50 mb-10 max-w-2xl mx-auto font-medium leading-relaxed">
          Conecta con tus amigos y familiares al instante. Envía mensajes, realiza llamadas y mantente en contacto con las personas que más te importan de manera privada.
        </p>
        
        <div class="flex flex-col sm:flex-row gap-4 justify-center items-center mb-20">
          <router-link to="/login" class="w-full sm:w-auto">
            <button class="w-full sm:w-auto bg-white text-whatsapp-dark-blue hover:bg-gray-50 font-semibold px-8 py-3.5 rounded-xl transition-all duration-200 shadow-[0_4px_14px_0_rgb(255,255,255,0.39)] hover:shadow-[0_6px_20px_rgba(255,255,255,0.23)] active:scale-[0.98]">
              Comenzar ahora
            </button>
          </router-link>
          
          <router-link to="/register" class="w-full sm:w-auto">
            <button class="w-full sm:w-auto bg-white/10 text-white backdrop-blur-sm hover:bg-white/20 border border-white/20 font-semibold px-8 py-3.5 rounded-xl transition-all duration-200 active:scale-[0.98]">
              Crear una cuenta
            </button>
          </router-link>
        </div>
      </div>

      <!-- Features -->
      <div class="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto w-full">
        <div class="text-center p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 hover:bg-white/10 transition-colors duration-300">
          <div class="p-3 bg-white/10 rounded-xl w-fit mx-auto mb-5">
            <Users class="h-6 w-6 text-white" stroke-width="1.5" />
          </div>
          <h3 class="text-lg font-semibold text-white mb-2 tracking-tight">Conexión Instantánea</h3>
          <p class="text-blue-100/80 text-sm leading-relaxed">Chatea con amigos y familiares en tiempo real con nuestra plataforma rápida.</p>
        </div>
        
        <div class="text-center p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 hover:bg-white/10 transition-colors duration-300">
          <div class="p-3 bg-white/10 rounded-xl w-fit mx-auto mb-5">
            <Shield class="h-6 w-6 text-white" stroke-width="1.5" />
          </div>
          <h3 class="text-lg font-semibold text-white mb-2 tracking-tight">Privado & Seguro</h3>
          <p class="text-blue-100/80 text-sm leading-relaxed">Tus conversaciones están protegidas con encriptación de extremo a extremo.</p>
        </div>
        
        <div class="text-center p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 hover:bg-white/10 transition-colors duration-300">
          <div class="p-3 bg-white/10 rounded-xl w-fit mx-auto mb-5">
            <Zap class="h-6 w-6 text-white" stroke-width="1.5" />
          </div>
          <h3 class="text-lg font-semibold text-white mb-2 tracking-tight">Ultra Rápido</h3>
          <p class="text-blue-100/80 text-sm leading-relaxed">Los mensajes se entregan al instante en todos tus dispositivos sincronizados.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { MessageCircle, Users, Shield, Zap } from 'lucide-vue-next'
</script>
