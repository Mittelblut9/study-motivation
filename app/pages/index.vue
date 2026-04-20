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
            <blockquote
                v-else
                class="text-center max-w-2xl text-2xl italic"
            >
                {{ quote }}
            </blockquote>
            <div class="flex justify-center mt-20">
                <RollQuoteButtonAtom @quote-generated="quote = $event" />
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
const quote = ref<string | null>(null);
</script>
