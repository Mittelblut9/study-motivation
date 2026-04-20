<template>
    <div>
        <div class="grid justify-center mt-30 gap-4">
            <div v-if="loading">
                <LoadingAtom />
            </div>
            <div
                v-show="!loading"
                class="grid gap-5"
            >
                <AdminMoodsComponent
                    :save-loading="saveLoading"
                    @update-component-ready="loading = false"
                    @update-save-loading="saveLoading = $event"
                >
                    <template #quotes="{ mood }">
                        <AdminQuotesComponent
                            :mood="mood"
                            :save-loading="saveLoading"
                            @update-save-loading="saveLoading = $event"
                        />
                    </template>
                </AdminMoodsComponent>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
const loading = ref(true);
const saveLoading = ref(false);
</script>
