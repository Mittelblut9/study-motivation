<template>
    <div
        v-if="!pageLoading"
        class="grid gap-3"
    >
        <UTabs
            v-model="selectedMood"
            :default-value="selectedMood"
            :content="false"
            :items="moods"
            color="neutral"
        />
        <UButton
            color="neutral"
            variant="outline"
            class="cursor-pointer"
            :label="useT('homepage.button.generate')"
            :loading="loading"
            @click="getNewQuote"
        />
    </div>
    <div v-else>
        <LoadingAtom />
    </div>
</template>

<script lang="ts" setup>
import type { TabsItem } from '@nuxt/ui';
import { captureException } from '@sentry/browser';

const loading = ref(false);
const pageLoading = ref(true);

const emit = defineEmits<{
    quoteGenerated: [quote: string];
}>();

const moods = ref<TabsItem[]>([]);
const selectedMood = ref<string>('0');

const { data, error } = await useAsyncData(
    'moods-data',
    (_nuxtApp, { signal }) => $fetch('/api/moods', { method: 'GET', signal, headers: useRequestHeaders(['cookie']) }),
);

onMounted(() => {
    if (error.value) {
        console.error('Error loading moods:', error.value);
        captureException(error.value);
        useToast().add({
            title: useT('homepage.error.moodsLoadFailed'),
            color: 'error',
        });
        return;
    }

    if (!data.value) {
        console.error('Failed to load moods:', error.value);
        return;
    }

    pageLoading.value = false;
    data.value.map((mood: Moods) => {
        moods.value.push({
            label: mood.name,
            value: mood.id.toString(),
        });
    });

    selectedMood.value = data.value[0].id.toString() || null;
});

function getNewQuote() {
    loading.value = true;
    $fetch<{ text: string }>('/api/quote', {
        query: {
            moodId: selectedMood.value,
        },
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
