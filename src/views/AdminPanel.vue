<template>
    <div class="min-h-screen bg-gray-50">
        <!-- Top Navigation -->
        <header class="bg-white border-b border-gray-200 sticky top-0 z-30">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="flex items-center justify-between h-16">
                    <div class="flex items-center gap-4">
                        <button @click="goBack"
                            class="p-2 -ml-2 rounded-md text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-colors duration-200 cursor-pointer">
                            <ArrowLeft class="w-5 h-5" />
                        </button>
                        <div class="flex items-center gap-3">
                            <div
                                class="w-8 h-8 rounded bg-gray-900 flex items-center justify-center shadow-sm">
                                <Shield class="w-4 h-4 text-white" />
                            </div>
                            <div>
                                <h1 class="text-base font-semibold text-gray-900 leading-tight">Panel de Administración</h1>
                                <p class="text-[13px] text-gray-500 font-medium">Gestión de usuarios y grupos</p>
                            </div>
                        </div>
                    </div>

                    <div class="flex items-center gap-3">
                        <button @click="showCreateGroup = true"
                            class="flex items-center gap-2 px-3.5 py-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-lg font-medium text-sm transition-colors duration-200 cursor-pointer shadow-sm">
                            <FolderPlus class="w-4 h-4" />
                            <span class="hidden sm:inline">Crear Grupo</span>
                        </button>
                        <button @click="showRegisterAI = true"
                            class="flex items-center gap-2 px-3.5 py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-lg font-medium text-sm transition-colors duration-200 cursor-pointer shadow-sm">
                            <Bot class="w-4 h-4" />
                            <span class="hidden sm:inline">Registrar IA</span>
                        </button>
                    </div>
                </div>
            </div>
        </header>

        <!-- Main Content -->
        <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <!-- Stats -->
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div class="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
                    <div class="flex items-center justify-between mb-4">
                        <p class="text-sm font-medium text-gray-500">Usuarios</p>
                        <Users class="w-4 h-4 text-gray-400" />
                    </div>
                    <p class="text-3xl font-semibold text-gray-900">{{ adminStore.users.length }}</p>
                </div>
                
                <div class="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
                    <div class="flex items-center justify-between mb-4">
                        <p class="text-sm font-medium text-gray-500">Activos</p>
                        <div class="flex items-center gap-1.5">
                            <span class="w-2 h-2 rounded-full bg-green-500"></span>
                            <UserCheck class="w-4 h-4 text-gray-400" />
                        </div>
                    </div>
                    <p class="text-3xl font-semibold text-gray-900">{{ activeUsersCount }}</p>
                </div>

                <div class="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
                    <div class="flex items-center justify-between mb-4">
                        <p class="text-sm font-medium text-gray-500">IAs</p>
                        <Bot class="w-4 h-4 text-gray-400" />
                    </div>
                    <p class="text-3xl font-semibold text-gray-900">{{ aiUsersCount }}</p>
                </div>

                <div class="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
                    <div class="flex items-center justify-between mb-4">
                        <p class="text-sm font-medium text-gray-500">Grupos</p>
                        <FolderClosed class="w-4 h-4 text-gray-400" />
                    </div>
                    <p class="text-3xl font-semibold text-gray-900">{{ adminStore.groups.length }}</p>
                </div>
            </div>

            <!-- Tabs -->
            <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden min-h-[400px]">
                <div class="flex border-b border-gray-200 bg-gray-50/50 px-4">
                    <button @click="activeTab = 'users'"
                        class="px-4 py-3 text-sm font-medium transition-colors duration-200 relative"
                        :class="activeTab === 'users' ? 'text-gray-900' : 'text-gray-500 hover:text-gray-700'">
                        Usuarios
                        <div v-if="activeTab === 'users'" class="absolute bottom-[-1px] left-0 w-full h-0.5 bg-gray-900"></div>
                    </button>
                    <button @click="activeTab = 'groups'"
                        class="px-4 py-3 text-sm font-medium transition-colors duration-200 relative"
                        :class="activeTab === 'groups' ? 'text-gray-900' : 'text-gray-500 hover:text-gray-700'">
                        Grupos
                        <div v-if="activeTab === 'groups'" class="absolute bottom-[-1px] left-0 w-full h-0.5 bg-gray-900"></div>
                    </button>
                </div>

                <!-- Loading State -->
                <div v-if="adminStore.loading" class="flex flex-col items-center justify-center p-20 text-center">
                    <Loader2 class="w-6 h-6 text-gray-400 animate-spin mb-3" />
                    <p class="text-sm font-medium text-gray-500">Cargando datos...</p>
                </div>

                <!-- Tab Content -->
                <div v-else class="p-0">
                    <UserTable v-if="activeTab === 'users'" :users="adminStore.users" @deactivate="handleDeactivate"
                        @remove-sessions="handleRemoveSessions" @assign-group="openAssignGroupModal" />
                    <GroupTable v-if="activeTab === 'groups'" :groups="adminStore.groups" />
                </div>
            </div>
        </main>

        <!-- Modals -->
        <RegisterAIModal v-if="showRegisterAI" @close="showRegisterAI = false" />
        <CreateGroupModal v-if="showCreateGroup" @close="showCreateGroup = false" />
        <AssignGroupModal v-if="assignGroupUserId !== null" :userId="assignGroupUserId" :groups="adminStore.groups"
            @close="assignGroupUserId = null" />
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowLeft, Shield, Bot, Users, UserCheck, FolderClosed, FolderPlus, Loader2 } from 'lucide-vue-next'
import useAdminStore from '@/stores/admin'
import UserTable from '@/components/admin/UserTable.vue'
import GroupTable from '@/components/admin/GroupTable.vue'
import RegisterAIModal from '@/components/admin/RegisterAIModal.vue'
import CreateGroupModal from '@/components/admin/CreateGroupModal.vue'
import AssignGroupModal from '@/components/admin/AssignGroupModal.vue'

const router = useRouter()
const adminStore = useAdminStore()

const activeTab = ref<'users' | 'groups'>('users')
const showRegisterAI = ref(false)
const showCreateGroup = ref(false)
const assignGroupUserId = ref<number | null>(null)

const activeUsersCount = computed(() => adminStore.users.filter(u => u.isActive).length)
const aiUsersCount = computed(() => adminStore.users.filter(u => u.isLlm).length)

const goBack = () => {
    router.push({ name: 'Dashboard' })
}

const handleDeactivate = async (userId: number) => {
    await adminStore.deactivateUser(userId)
}

const handleRemoveSessions = async (userId: number) => {
    await adminStore.removeSessions(userId)
}

const openAssignGroupModal = (userId: number) => {
    assignGroupUserId.value = userId
}

onMounted(async () => {
    await Promise.all([adminStore.fetchUsers(), adminStore.fetchGroups()])
})
</script>
