<template>
  <div class="min-h-screen bg-gradient-auth">
    <!-- Hero Section -->
    <div class="container mx-auto px-4 py-16">
      <div class="text-center mb-16">
        <div class="flex justify-center mb-6">
          <div class="p-6 bg-white/10 backdrop-blur-sm rounded-full">
            <MessageCircle class="h-16 w-16 text-white" />
          </div>
        </div>
        <h1 class="text-5xl md:text-6xl font-bold text-white mb-6">
          WhatsApp Clone
        </h1>
        <p class="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
          Connect with friends and family instantly. Send messages, make calls, and stay in touch with the people who matter most.
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <router-link to="/login">
            <button class="bg-white text-whatsapp-dark-blue hover:bg-white/90 font-medium px-8 py-3 text-lg rounded-lg transition-smooth">
              Get Started
            </button>
          </router-link>
          <router-link to="/register">
            <button class="border border-white/30 text-white hover:bg-white/10 font-medium px-8 py-3 text-lg rounded-lg transition-smooth">
              Create Account
            </button>
          </router-link>
        </div>
      </div>

      <!-- Features -->
      <div class="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
        <div class="text-center">
          <div class="p-4 bg-white/10 backdrop-blur-sm rounded-full w-fit mx-auto mb-4">
            <Users class="h-8 w-8 text-white" />
          </div>
          <h3 class="text-xl font-semibold text-white mb-2">Connect Instantly</h3>
          <p class="text-white/70">Chat with friends and family in real-time with our fast messaging platform.</p>
        </div>
        <div class="text-center">
          <div class="p-4 bg-white/10 backdrop-blur-sm rounded-full w-fit mx-auto mb-4">
            <Shield class="h-8 w-8 text-white" />
          </div>
          <h3 class="text-xl font-semibold text-white mb-2">Secure & Private</h3>
          <p class="text-white/70">Your conversations are protected with end-to-end encryption.</p>
        </div>
        <div class="text-center">
          <div class="p-4 bg-white/10 backdrop-blur-sm rounded-full w-fit mx-auto mb-4">
            <Zap class="h-8 w-8 text-white" />
          </div>
          <h3 class="text-xl font-semibold text-white mb-2">Lightning Fast</h3>
          <p class="text-white/70">Messages are delivered instantly across all your devices.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { MessageCircle, Users, Shield, Zap } from 'lucide-vue-next'
</script>
