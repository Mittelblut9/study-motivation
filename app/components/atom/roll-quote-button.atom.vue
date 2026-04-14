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

const emit = defineEmits<{
    quoteGenerated: [quote: string];
}>();

async function getNewQuote() {
    loading.value = true;
    $fetch<{ text: string }>('/api/quote', {
        method: 'GET',
    }).then((data) => {
        console.log('Received quote:', data);
        emit('quoteGenerated', data.text);
    }).catch((error) => {
        console.error('Error fetching quote:', error);
    }).finally(() => {
        loading.value = false;
    });
}
</script>
