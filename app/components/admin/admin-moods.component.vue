<template>
    <UAccordion
        :items="state.moods.map((mood, i) => ({
            label: mood.name,
            value: String(i),
        }))"
    >
        <template #content="{ item }">
            <UForm
                class="grid gap-4"
                :state="state.moods[Number(item.value)]"
                :schema="moodQuotesSchema"
                @submit.prevent="saveMoods"
            >
                <UFormField :label="useT('admin.moods.input.label')">
                    <UInput
                        v-model="state.moods[Number(item.value)].name"
                        color="neutral"
                        variant="outline"
                        :ui="{
                            base: 'w-97',
                        }"
                        :placeholder="useT('admin.moods.input.placeholder')"
                    />
                    <USeparator
                        class="my-4"
                    />
                    <UFormField :label="useT('admin.quotes.header.label')">
                        <slot
                            name="quotes"
                            :mood="state.moods[Number(item.value)]"
                        />
                    </UFormField>
                </UFormField>
                <UButton
                    color="neutral"
                    :label="useT('admin.moods.saveButton.label')"
                    :aria-label="useT('admin.moods.saveButton.aria-label')"
                    :loading="saveLoading"
                    type="submit"
                />
            </UForm>
        </template>
    </UAccordion>
</template>

<script lang="ts" setup>
import { captureException } from '@sentry/browser';
import z from 'zod';

const moodQuotesSchema = z.object({
    name: z.string().min(1, { message: 'Mood name cannot be empty' }),
    moods: z.array(
        z.string().min(1, { message: 'Mood cannot be empty' })
    ).min(1, { message: 'At least one mood is required' }),
});
const state = reactive({
    name: '',
    moods: [] as Moods[],
});

const emit = defineEmits<{
    (e: 'update-component-ready' | 'update-save-loading', value: boolean): void;
}>();

const { saveLoading } = defineProps<{
    saveLoading: boolean;
}>();

onMounted(() => {
    $fetch('/api/moods')
        .then((data) => {
            state.moods = data;
            emit('update-component-ready', true);
        })
        .catch((error) => {
            console.error('Failed to load moods:', error);
            captureException(error);
            useToast().add({
                description: useT('admin.moods.errors.loadFailed'),
                color: 'error',
            });
        });
});

function saveMoods() {
    emit('update-save-loading', true);
    try {
        $fetch('/api/moods', {
            method: 'POST',
            body: state,
        })
            .then(() => {
                useToast().add({
                    description: useT('admin.moods.success.saved'),
                    color: 'success',
                });
            })
            .catch((error) => {
                console.error('Failed to save moods:', error);
                captureException(error);
                useToast().add({
                    description: useT('admin.moods.errors.saveFailed'),
                    color: 'error',
                });
            });
    } catch (error) {
        console.error('Failed to save moods:', error);
        captureException(error);
        useToast().add({
            description: useT('admin.moods.errors.validationFailed'),
            color: 'error',
        });
    } finally {
        setTimeout(() => {
            emit('update-save-loading', false);
        }, 1000);
    }
}
</script>
