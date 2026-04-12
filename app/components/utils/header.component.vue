<template>
    <UHeader>
        <UNavigationMenu :items="links" />
        <template #left>
            <ULink
                :to="ERoutes.HOME"
                prefetch
            >
                <img
                    src="/img/Learning 7TV.png"
                    alt="Logo"
                    class="h-10 w-auto"
                >
            </ULink>
        </template>
        <template #right>
            <AuthState v-slot="{ loggedIn, clear }">
                <button
                    v-if="loggedIn"
                    @click="clear"
                >
                    Logout
                </button>
                <NuxtLink
                    v-else
                    :to="ERoutes.LOGIN"
                >Login</NuxtLink>
            </AuthState>
        </template>
    </UHeader>
</template>

<script lang="ts" setup>
import { ERoutes } from '~/utils/enum/Routes.enum';

const links = [
    {
        label: useT('header.links.admin.label'),
        icon: useT('header.links.admin.icon'),
        to: useT('header.links.admin.to')
    },
];
</script>
