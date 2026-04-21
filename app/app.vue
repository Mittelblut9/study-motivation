<template>
    <div>
        <NuxtLoadingIndicator />
        <UApp>
            <NuxtLayout>
                <NuxtPage />
            </NuxtLayout>
        </UApp>
    </div>
</template>

<script lang="ts" setup>
useHead({
    title: () => (useRoute().meta.title as string) || '',
    titleTemplate: title => (title ? `${title} - Study Motivation` : 'Study Motivation'),
});
</script>
