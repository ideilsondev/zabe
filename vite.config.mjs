import { PrimeVueResolver } from '@primevue/auto-import-resolver'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'
import Components from 'unplugin-vue-components/vite'
import { defineConfig, loadEnv } from 'vite'
import { createHtmlPlugin } from 'vite-plugin-html'

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), '')

    return {
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
                dirs: [
                    'src/**/components'
                ],
                deep: true,
                extensions: ['vue'],
                resolvers: [PrimeVueResolver()]
            }),
            createHtmlPlugin({
                minify: true,
                inject: {
                    data: {
                        title: env.VITE_APP_TITLE || 'Não informado',
                        lang: env.VITE_APP_LANG || 'pt-BR',
                        appId: env.VITE_APP_ID || 'app-root',
                        description: env.VITE_APP_DESCRIPTION || 'Descrição não informada'
                    }
                }
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
    }
})
