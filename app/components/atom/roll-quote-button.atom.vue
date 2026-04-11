<template>
    <UButton
        color="neutral"
        variant="outline"
        class="cursor-pointer"
        :label="useT('homepage.button.generate')"
        :loading="loading"
        @click="getNewQuote"
    />
</template>

<script lang="ts" setup>
const loading = ref(false);

async function getNewQuote() {
    loading.value = true;
    const { data, error, status } = await useAsyncData('quote', (_nuxtApp, { signal }) => $fetch('/api/quote', { signal }));
    loading.value = false;

    console.log('quote', { data, error, status });
}
</script>
