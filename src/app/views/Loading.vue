<template>
    <div class="flex items-center justify-center min-h-screen bg-surface-50 dark:bg-surface-900">
        <div class="card p-6 bg-surface-0 dark:bg-surface-800 shadow-lg rounded-lg">
            <div v-if="isLoading" class="flex flex-col items-center gap-4">
                <ProgressSpinner style="width: 50px; height: 50px" />
                <span class="text-3xl text-surface-700 dark:text-surface-200">Carregando Sistema</span>
            </div>
            <div v-else-if="errorMessage" class="flex flex-col items-center gap-4">
                <i class="pi pi-exclamation-triangle text-red-500 text-4xl"></i>
                <span class="text-xl text-surface-700 dark:text-surface-200">{{ errorMessage }}</span>
                <Button v-if="errorMessage === 'Sistema offline'" label="Tentar novamente" @click="checkConnection" />
                <Button v-else label="Ir para Login" @click="goToLogin" />
            </div>
        </div>
    </div>
</template>

<script setup>
    import { supabase } from '@/app/services/supabase';
    import { onMounted, ref } from 'vue';
    import { useRouter } from 'vue-router';

    const isLoading = ref(true);
    const errorMessage = ref(null);
    const router = useRouter();

    async function checkConnection() {
        isLoading.value = true;
        errorMessage.value = null;

        try {
            // Test Supabase connection by fetching the user session
            const { data: { session }, error } = await supabase.auth.getSession();

            if (error) {
                if (error.message.includes('network') || error.message.includes('Failed to fetch')) {
                    errorMessage.value = 'Sistema offline';
                } else if (error.status === 503) {
                    errorMessage.value = 'Servidor em manutenção';
                } else {
                    errorMessage.value = 'Erro ao conectar ao sistema';
                }
                isLoading.value = false;
                return;
            }

            // If session exists, redirect to dashboard
            if (session) {
                router.push({ name: 'dashboard' });
            } else {
                // No session, redirect to login
                router.push({ name: 'auth-user' });
            }
        } catch (err) {
            errorMessage.value = 'Sistema offline';
            isLoading.value = false;
        }
    }

    function goToLogin() {
        router.push('/login');
    }

    onMounted(() => {
        checkConnection();
    });
</script>

<style lang="scss" scoped></style>