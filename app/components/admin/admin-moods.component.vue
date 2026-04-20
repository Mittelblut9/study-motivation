<template>
    <UProgress
        v-if="status === 'pending'"
        class="space-y-2"
        animation="carousel"
        color="neutral"
    />
    <div
        v-else-if="status === 'success'"
        class="grid justify-center mt-30 gap-4"
    >
        <UAccordion
            :items="state.moods.map((mood, i) => ({
                label: mood.name,
                value: String(i),
            }))"
        >
            <template #content="{ item }">
                <UFormField
                    :label="useT('admin.moods.input.label')"
                    name="name"
                >
                    <UInput
                        v-model="state.moods[Number(item.value)].name"
                        color="neutral"
                        variant="outline"
                        :ui="{
                            base: 'w-full md:w-97',
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
            </template>
        </UAccordion>

        <UButton
            color="neutral"
            :label="useT('admin.moods.addButton.label')"
            :aria-label="useT('admin.moods.addButton.aria-label')"
            @click="addMood"
        />

        <USeparator
            class="my-4"
        />

        <UButton
            color="neutral"
            :label="useT('admin.moods.saveButton.label')"
            :aria-label="useT('admin.moods.saveButton.aria-label')"
            :loading="saveLoading"
            @click="saveMoods"
        />
    </div>
    <div
        v-else
        class="text-red-500"
    >
        {{ error }}
    </div>
</template>

<script lang="ts" setup>
import { captureException } from '@sentry/browser';
import z from 'zod';

const moodQuotesSchema = z.object({
    moods: z.array(
        z.object({
            name: z.string().min(1, { message: 'Mood name is required' }),
            id: z.number(),
        })
    ).min(1, { message: 'At least one mood is required' }),
});
const state = reactive({
    moods: [] as Moods[],
});

const emit = defineEmits<{
    (e: 'update-save-loading', value: boolean): void;
}>();

const { saveLoading } = defineProps<{
    saveLoading: boolean;
}>();

const {
    data: moods,
    status,
    refresh,
    error,
} = await useFetch<(Moods)[]>('/api/moods', {
    dedupe: 'cancel',
    default: () => [],
});

onMounted(() => {
    state.moods = moods.value;
});

function saveMoods() {
    emit('update-save-loading', true);

    try {
        moodQuotesSchema.parse(state);
    } catch (error) {
        console.error('Validation failed:', error);
        captureException(error);
        useToast().add({
            description: useT('admin.moods.errors.validationFailed'),
            color: 'error',
        });
        emit('update-save-loading', false);
        return;
    }

    try {
        $fetch('/api/moods', {
            method: 'POST',
            body: state,
        })
            .then(async () => {
                await refresh();
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

function addMood() {
    state.moods.push({
        name: '',
        id: Date.now(),
    });
}
</script>
