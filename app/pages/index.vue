<template>
    <div>
        <div class="flex justify-center">
            <h1
                class="text-5xl mt-10"
                v-html="useT('homepage.header.text')"
            />
        </div>
        <div class="grid justify-center mt-30">
            <h2
                v-if="!quote"
                class="text-center max-w-2xl text-2xl"
                v-html="useT('homepage.subheader.noQuoteSelected')"
            />
            <div class="flex justify-center mt-20">
                <UButton
                    color="neutral"
                    variant="outline"
                    class="cursor-pointer"
                    :label="useT('homepage.button.generate')"
                />
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
const quote = ref<string | null>(null);
</script>
