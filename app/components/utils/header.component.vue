<template>
    <UHeader :items="links">
        <UNavigationMenu
            id="navMenu"
            :items="links"
            color="neutral"
            highlight
        />
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
        <template #body>
            <UNavigationMenu
                :items="links"
                orientation="vertical"
                color="neutral"
                class="-mx-2.5"
            />
        </template>
        <template #right>
            <AuthState v-slot="{ loggedIn, clear, user }">
                <span
                    v-if="loggedIn"
                    v-html="useT('header.authState.loggedInAs', {
                        name: user.name,
                    })"
                />
                <button
                    v-if="loggedIn"
                    class="cursor-pointer"
                    @click="clear"
                >
                    <span v-html="useT('header.authState.logout')" />
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

const icons = [
    'material-symbols:mood-bad-outline',
    'material-symbols:mood-outline-rounded',
    'tabler:mood-angry',
    'tabler:mood-annoyed',
    'tabler:mood-crazy-happy',
];

const randomIndex = Math.floor(Math.random() * icons.length);
const currentIcon = ref<string>(icons[randomIndex]);

const links = [
    {
        label: useT('header.links.admin.label'),
        icon: currentIcon.value,
        to: ERoutes.ADMIN
    },
];
</script>
