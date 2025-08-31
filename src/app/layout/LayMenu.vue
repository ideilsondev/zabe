<template>
    <ul class="layout-menu">
        <template v-for="(item, i) in model" :key="item">
            <lay-menu-item v-if="!item.separator" :item="item" :index="i"></lay-menu-item>
            <li v-if="item.separator" class="menu-separator"></li>
        </template>
    </ul>
</template>

<script setup>
    import { computed } from 'vue';
    import LayMenuItem from './LayMenuItem.vue';

    const demoProfile = {
        role: 'bembaixo'
    };

    function checkRole(roles) {
        return roles.includes(demoProfile.role);
    }

    const roleHierarchy = ['bembaixo', 'system', 'manager', 'admin', 'owner', 'outronivel'];

    const menuItemsByRole = {
        system: [{ label: 'Usuarios', icon: 'pi pi-fw pi-home', to: '/' }],
        manager: [{ label: 'Gerentes', icon: 'pi pi-fw pi-home', to: '/' }],
        admin: [{ label: 'Administrador', icon: 'pi pi-fw pi-home', to: '/' }],
        owner: [{ label: 'Dono', icon: 'pi pi-fw pi-home', to: '/' }],
        outronivel: [{ label: 'Outro nivel', icon: 'pi pi-fw pi-home', to: '/' }],
        bembaixo: [{ label: 'Bem baixo', icon: 'pi pi-fw pi-home', to: '/' }]
    };

    const menuList = computed(() => {
        const userRoleIndex = roleHierarchy.findIndex((role) => checkRole(role));

        if (userRoleIndex === -1) return [];
        const accessibleItems = roleHierarchy.slice(0, userRoleIndex + 1).flatMap((role) => menuItemsByRole[role] || []);
        return accessibleItems;
    });

    const model = computed(() => {
        return [{
            label: 'Menu', icon: 'pi pi-fw pi-bars', items: menuList.value
        }];
    });
</script>
