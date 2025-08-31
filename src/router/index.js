import LayContent from '@/app/layout/LayContent.vue';
import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/dashboard',
            component: LayContent,
            children: [
                {
                    path: '/',
                    name: 'dashboard',
                    component: () => import('@/app/auth/Dashboard.vue'),
                    meta: { requiresAuth: true, title: 'Dashboard' }
                }
            ]
        },
        {
            path: '/',
            name: 'loading',
            component: () => import('@/app/views/Loading.vue')
        },
        {
            path: '/notfound',
            name: 'notfound',
            component: () => import('@/views/pages/NotFound.vue')
        },

        {
            path: '/auth/login',
            name: 'auth-user',
            component: () => import('@/app/auth/AuthLogin.vue')
        },
        {
            path: '/auth/access',
            name: 'accessDenied',
            component: () => import('@/views/pages/auth/Access.vue')
        },
        {
            path: '/auth/error',
            name: 'error',
            component: () => import('@/views/pages/auth/Error.vue')
        }, {
            path: '/:pathMatch(.*)*',
            redirect: '/notfound',
            meta: { requiresAuth: false, title: 'Página Não Encontrada ' },
        },
    ]
});

export default router;
