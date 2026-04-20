<template>
    <div>
        <AdminMoodsComponent
            :save-loading="saveLoading"
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
</template>

<script lang="ts" setup>
const saveLoading = ref(false);
</script>
