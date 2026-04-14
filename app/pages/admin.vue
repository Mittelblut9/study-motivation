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
                        :placeholder="useT('admin.quotes.textarea.placeholder')"
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
                                :aria-label="useT('admin.quotes.textarea.remove.aria-label')"
                                @click="removeQuote(value)"
                            />
                        </template>
                    </UTextarea>
                </div>
                <div class="flex justify-center">
                    <UButton
                        color="neutral"
                        :icon="'i-lucide-plus'"
                        :aria-label="useT('admin.quotes.addButton.aria-label')"
                        @click="addQuote"
                    />
                </div>
                <div
                    v-if="quotes.length > 0"
                    class="flex justify-center"
                >
                    <UButton
                        color="neutral"
                        :label="useT('admin.quotes.saveButton.label')"
                        :aria-label="useT('admin.quotes.saveButton.aria-label')"
                        :loading="saveLoading"
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
const saveLoading = ref(false);

onMounted(async () => {
    try {
        const response = await $fetch('/api/quotes');
        quotes.value.push(...response);
    } catch (_err) {
        useToast().add({
            description: useT('admin.quotes.errors.fetchFailed'),
            color: 'error',
        });
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
            description: useT('admin.quotes.errors.noChanges'),
            color: 'neutral',
        });
        return;
    }
    saveLoading.value = true;

    $fetch('/api/quotes', {
        method: 'POST',
        body: {
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
        saveLoading.value = false;
        newQuotes.value = [];
        removedQuotes.value = [];
        updatedQuotes.value = [];
    });
}
</script>
