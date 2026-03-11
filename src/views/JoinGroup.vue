<template>
    <div
        class="min-h-screen bg-gradient-to-br from-whatsapp-dark-blue to-whatsapp-sky-blue flex items-center justify-center p-4">
        <div class="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md transform transition-all duration-300">

            <div class="text-center mb-6">
                <div
                    class="w-16 h-16 bg-gradient-to-r from-whatsapp-dark-blue to-whatsapp-sky-blue rounded-full mx-auto mb-4 flex items-center justify-center text-white">
                    <Loader2 v-if="isLoading" class="w-8 h-8 animate-spin" />
                    <CheckCircle v-else-if="isMember" class="w-8 h-8" />
                    <Users v-else class="w-8 h-8" />
                </div>

                <h1 class="text-2xl font-bold text-gray-800 mb-2">Unirse al Grupo</h1>
                <p class="text-whatsapp-gray font-mono bg-gray-100 py-1 px-3 rounded inline-block">
                    {{ route.params.clave }}
                </p>
            </div>

            <div v-if="isLoading" class="text-center text-whatsapp-gray py-4">
                Verificando tu estado en el grupo...
            </div>

            <div v-else-if="isMember" class="text-center space-y-6">
                <div class="p-4 bg-green-50 text-green-700 rounded-lg border border-green-200">
                    <p class="font-medium">Ya perteneces a este grupo.</p>
                </div>

                <RouterLink :to="{ name: 'Dashboard' }"
                    class="block w-full py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors duration-200 text-center">
                    Ir al Inicio
                </RouterLink>
            </div>

            <div v-else class="space-y-6">
                <p class="text-center text-whatsapp-gray mb-4">
                    Has sido invitado a unirte a este grupo. ¿Deseas ingresar?
                </p>

                <button @click="joinGroup" :disabled="isJoining"
                    class="w-full py-3 bg-gradient-to-r from-whatsapp-dark-blue to-whatsapp-sky-blue text-white rounded-lg font-semibold hover:from-whatsapp-sky-blue hover:to-whatsapp-dark-blue transition-all duration-300 transform hover:scale-105 shadow-lg flex justify-center items-center disabled:opacity-70 disabled:hover:scale-100 disabled:cursor-not-allowed">
                    <Loader2 v-if="isJoining" class="w-5 h-5 mr-2 animate-spin" />
                    <span>{{ isJoining ? 'Uniéndote...' : 'Unirse al Grupo' }}</span>
                </button>
            </div>

        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { storeToRefs } from 'pinia';
import { Users, CheckCircle, Loader2 } from 'lucide-vue-next';
import useUserGroupStore from '@/stores/userGroup';

const route = useRoute();

const userGroupStore = useUserGroupStore();
const { isLoading, isMember } = storeToRefs(userGroupStore);
const isJoining = ref(false);

const clave = route.params.clave as string;

watch(
    () => route.params.clave,
    (newId) => {
        if (newId) {
            userGroupStore.verifyUserInGroup(newId as string);
        }
    },
    { immediate: true }
);

const joinGroup = async () => {
    if (!clave) return;
    isJoining.value = true;
    await userGroupStore.addUserToGroup(clave);
    isJoining.value = false;
    await userGroupStore.verifyUserInGroup(clave);
};
</script>