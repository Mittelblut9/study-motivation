<template>
    <div class="grid gap-4">
        <div v-if="quotes.length === 0">
            <p
                class="italic text-sm text-neutral-500"
                v-html="useT('admin.quotes.empty.message')"
            />
        </div>
        <div
            v-for="value in quotes"
            :key="value.id"
        >
            <UTextarea
                v-model="value.text"
                color="neutral"
                variant="outline"
                :ui="{
                    root: 'flex items-start gap-2',
                    base: 'w-full ms-3',
                }"
                :placeholder="useT('admin.quotes.textarea.placeholder')"
                autoresize
                @update:model-value="updateQuote(value)"
            >
                <template
                    #trailing
                >
                    <UButton
                        color="neutral"
                        variant="link"
                        size="sm"
                        icon="i-lucide-circle-x"
                        :aria-label="useT('admin.quotes.textarea.remove.aria-label')"
                        @click="removeQuote(value)"
                    />
                </template>
            </UTextarea>
        </div>
    </div>
    <div class="flex justify-center">
        <UButton
            color="neutral"
            :icon="'i-lucide-plus'"
            :aria-label="useT('admin.quotes.addButton.aria-label')"
            @click="addQuote"
        />
    </div>
    <div class="flex justify-center">
        <UButton
            color="neutral"
            :label="useT('admin.quotes.saveButton.label')"
            :aria-label="useT('admin.quotes.saveButton.aria-label')"
            :loading="saveLoading"
            @click="saveQuotes"
        />
    </div>
</template>

<script lang="ts" setup>
import z from 'zod';
import type Quote from '~~/shared/types/Quotes';

const quotes = ref<Quote[]>([]);
const updatedQuotes = ref<Quote[]>([]);
const removedQuotes = ref<Quote[]>([]);
const newQuotes = ref<Quote[]>([]);

const quotesSchema = z.array(z.object({ text: z.string(), id: z.number() }));

const newQuote = { id: 0, text: '' };

const emit = defineEmits<{
    (event: 'update-component-ready' | 'update-save-loading', value: boolean): void;
}>();

const { saveLoading, mood } = defineProps<{
    saveLoading: boolean;
    mood: Moods;
}>();

onMounted(async () => {
    try {
        const { data, refresh } = await useFetch<Quote[]>('/api/quotes', {
            method: 'GET',
            query: { moodId: mood.id },
            getCachedData: (key, nuxtApp) => {
                return nuxtApp.payload.data[key] ?? nuxtApp.static.data[key];
            },
        });

        if (!data.value) {
            console.warn('No cached data found for quotes, fetching from API...');
            await refresh();
        } else {
            quotes.value.push(...data.value);
        }
    } catch (err) {
        console.error('Failed to fetch quotes:', err);
        useToast().add({
            description: useT('admin.quotes.errors.fetchFailed'),
            color: 'error',
        });
    } finally {
        updateComponentReady(true);
    }
});

function addQuote() {
    const quote = { ...newQuote, id: Math.random() * 10000 };
    quotes.value.push(quote);
    newQuotes.value.push(quote);
}

function removeQuote(quote: Quote) {
    quotes.value = quotes.value.filter(q => q.id !== quote.id);
    removedQuotes.value.push(quote);
}

function updateQuote(quote: Quote) {
    const existingIndex = updatedQuotes.value.findIndex(q => q.id === quote.id);
    if (existingIndex !== -1) {
        updatedQuotes.value[existingIndex] = quote;
    } else {
        updatedQuotes.value.push(quote);
    }
}

function saveQuotes() {
    if (newQuotes.value.length === 0 && removedQuotes.value.length === 0 && updatedQuotes.value.length === 0) {
        useToast().add({
            description: useT('admin.quotes.errors.noChanges'),
            color: 'neutral',
        });
        return;
    }
    updateSaveLoading(true);

    try {
        quotesSchema.parse(quotes.value);
    } catch (err) {
        console.error('Validation failed:', err);
        useToast().add({
            description: useT('admin.quotes.errors.validationFailed'),
            color: 'error',
        });
        updateSaveLoading(false);
        return;
    }

    $fetch('/api/quotes', {
        method: 'POST',
        body: {
            moodId: mood.id,
            newQuotes: newQuotes.value,
            removedQuotes: removedQuotes.value,
            updatedQuotes: updatedQuotes.value,
        },
    }).then(() => {
        useToast().add({
            description: useT('admin.quotes.success.saved'),
            color: 'neutral',
        });
    }).catch(() => {
        useToast().add({
            description: useT('admin.quotes.errors.saveFailed'),
            color: 'error',
        });
    }).finally(() => {
        updateSaveLoading(false);
        newQuotes.value = [];
        removedQuotes.value = [];
        updatedQuotes.value = [];
    });
}

function updateComponentReady(isReady: boolean) {
    emit('update-component-ready', isReady);
}

function updateSaveLoading(isLoading: boolean) {
    emit('update-save-loading', isLoading);
}
</script>
