<template>
    <div>
        <div class="flex justify-center">
            <h1
                class="text-5xl mt-10 max-w-2xl text-center"
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
                <RollQuoteButtonAtom @quote-generated="quote = $event" />
            </div>
        </div>

        <UModal
            v-model:open="modalOpen"
            fullscreen
        >
            <template #body>
                <div class="min-h-full grid place-items-center">
                    <blockquote
                        class="text-center text-2xl italic"
                    >
                        {{ quote }}
                    </blockquote>
                </div>
            </template>
        </UModal>
    </div>
</template>

<script lang="ts" setup>
const quote = ref<string | null>(null);
const modalOpen = ref(false);

watch(quote, (newQuote) => {
    if (newQuote) {
        modalOpen.value = true;
    }
});

watch(modalOpen, (isOpen) => {
    if (!isOpen) {
        quote.value = null;
    }
});
</script>
