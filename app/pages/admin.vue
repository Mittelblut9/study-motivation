<template>
    <div>
        <div class="grid justify-center mt-30 gap-4">
            <div v-if="loading">
                <LoadingAtom />
            </div>
            <div
                v-else
                class="grid gap-4"
            >
                <div
                    v-for="value in quotes"
                    :key="value.id"
                >
                    <UTextarea
                        v-model="value.text"
                        color="neutral"
                        variant="outline"
                        :ui="{
                            base: 'w-97',
                        }"
                        autoresize
                    >
                        <template
                            #trailing
                        >
                            <UButton
                                color="neutral"
                                variant="link"
                                size="sm"
                                icon="i-lucide-circle-x"
                                aria-label="Remove quote"
                                @click="removeQuote(value)"
                            />
                        </template>
                    </UTextarea>
                </div>
                <div class="flex justify-center">
                    <UButton
                        color="neutral"
                        :icon="'i-lucide-plus'"
                        aria-label="Add quote"
                        @click="addQuote"
                    />
                </div>
                <div
                    v-if="quotes.length > 0"
                    class="flex justify-center"
                >
                    <UButton
                        color="neutral"
                        label="Save Quotes"
                        @click="saveQuotes"
                    />
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import type Quote from '~~/shared/types/Quotes';

const quotes = ref<Quote[]>([]);
const updatedQuotes = ref<Quote[]>([]);
const removedQuotes = ref<Quote[]>([]);
const newQuotes = ref<Quote[]>([]);

const newQuote = { id: 0, text: '' };

const loading = ref(true);

onMounted(async () => {
    try {
        const response = await $fetch('/api/quotes');
        quotes.value.push(...response);
    } catch (err) {
        console.error('Failed to fetch quotes:', err);
    } finally {
        loading.value = false;
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

function saveQuotes() {
    if (newQuotes.value.length === 0 && removedQuotes.value.length === 0 && updatedQuotes.value.length === 0) {
        useToast().add({
            description: 'No changes to save.',
            color: 'neutral',
        });
        return;
    }

    $fetch('/api/quotes', {
        method: 'POST',
        body: {
            newQuotes: newQuotes.value,
            removedQuotes: removedQuotes.value,
            updatedQuotes: updatedQuotes.value,
        },
    }).then(() => {
        useToast().add({
            description: 'Quotes saved successfully!',
            color: 'neutral',
        });
    }).catch((err) => {
        console.error('Failed to save quotes:', err);
        useToast().add({
            description: 'Failed to save quotes. Please try again.',
            color: 'error',
        });
    }).finally(() => {
        newQuotes.value = [];
        removedQuotes.value = [];
        updatedQuotes.value = [];
    });
}
</script>
