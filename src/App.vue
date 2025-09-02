<script setup>
    import { onMounted } from 'vue';
    import { useAuthStore } from './app/stores/auth';

    const { initializeAuth } = useAuthStore();

    onMounted(async () => {
        await initializeAuth();
    })
</script>

<template>
    <router-view />
</template>

<style scoped></style>
