<template>
    <div class="h-screen bg-white flex overflow-hidden">
        <!-- Sidebar - Lista de contactos (30%) -->
        <ContactList :isMobile="isMobile" />

        <!-- Chat Area (70%) -->
        <ChatView :isMobile="isMobile" />
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import ContactList from '@/components/Contact.vue'
import ChatView from '@/components/ChatView.vue'
import useWebSocketStore from '@/stores/webSocket'
import useUserStore from '@/stores/user'
import useClusterStore from '@/stores/cluster'

const webSocketStore = useWebSocketStore()
const userStore = useUserStore()
const clusterStore = useClusterStore()

// Reactive data
const isMobile = ref(false)

const checkMobile = () => {
    isMobile.value = window.innerWidth < 768
}

const getData = async () => {
    await userStore.getUser()
    await clusterStore.getAllClustersUser()
}

// Lifecycle
onMounted(() => {
    checkMobile()
    window.addEventListener('resize', checkMobile)
    getData()
    webSocketStore.connect()
})

onBeforeUnmount(() => {
    window.removeEventListener('resize', checkMobile)
    webSocketStore.disconnect()
})
</script>

<style scoped>
/* Solo mantenemos las animaciones globales si son necesarias */
.transition-all {
    transition: all 0.2s ease-in-out;
}
</style>