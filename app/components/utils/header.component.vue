<template>
    <UHeader>
        <UNavigationMenu :items="links" />
        <template #left>
            <img
                src="/img/Learning 7TV.png"
                alt="Logo"
                class="h-10 w-auto"
            >
        </template>
    </UHeader>
</template>

<script lang="ts" setup>
const links = [
    {
        label: useT('header.links.admin.label'),
        icon: useT('header.links.admin.icon'),
        to: useT('header.links.admin.to')
    },
];
</script>
