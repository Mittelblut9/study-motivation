<template>
    <div>
        <div class="grid justify-center mt-30 gap-4">
            <div v-if="loading">
                <LoadingAtom />
            </div>
            <div
                v-show="!loading"
                class="grid gap-4"
            >
                <AdminQuotesComponent
                    :save-loading="saveLoading"
                    @update-component-ready="componentsReady.quotes = true"
                    @update-save-loading="saveLoading = $event"
                />
            </div>
            <div
                v-show="!loading"
                class="grid gap-5"
            >
                <USeparator />
                <AdminMoodsComponent
                    :save-loading="saveLoading"
                    @update-component-ready="componentsReady.moods = true"
                    @update-save-loading="saveLoading = $event"
                />
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
const loading = ref(true);
const saveLoading = ref(false);

const componentsReady = ref({
    quotes: false,
    moods: false,
});

watch(
    () => componentsReady.value,
    (newVal) => {
        loading.value = !(newVal.quotes && newVal.moods);
    },
    { deep: true }
);
</script>
