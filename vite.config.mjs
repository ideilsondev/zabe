import { PrimeVueResolver } from '@primevue/auto-import-resolver'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'
import Components from 'unplugin-vue-components/vite'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
    optimizeDeps: {
        noDiscovery: true,
        include: [
            '@supabase/supabase-js',
            '@supabase/postgrest-js',
            '@supabase/realtime-js',
            '@supabase/storage-js'
        ]
    },
    plugins: [
        vue(),
        Components({
            resolvers: [PrimeVueResolver()]
        })
    ],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        }
    },
    build: {
        commonjsOptions: {
            include: [/node_modules/]
        }
    },
    define: {
        global: 'globalThis'
    }
})