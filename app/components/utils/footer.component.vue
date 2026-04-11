<template>
    <UFooter>
        <template #left>
            <span
                v-text="useT('footer.copyright', {
                    year: new Date().getFullYear(),
                })"
            />
        </template>
        <p v-html="useT('footer.codedByHumans')" />
        <template #right>
            <p class="flex items-center gap-2">
                {{ useT('footer.developedBy') }}
                <UButton
                    icon="i-simple-icons-github"
                    color="neutral"
                    variant="ghost"
                    to="https://github.com/Mittelblut9"
                    target="_blank"
                />
            </p>
        </template>
    </UFooter>
</template>
