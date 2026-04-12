<template>
    <div class="flex flex-col items-center justify-center gap-4 p-4">
        <UPageCard class="w-full max-w-md">
            <UAuthForm
                :schema="schema"
                :title="useT('register.title')"
                :description="useT('register.description')"
                icon="i-lucide-user"
                :fields="fields"
                @submit="onSubmit"
            >
                <template #description>
                    {{ useT('register.description.text') }} <ULink
                        :to="ERoutes.LOGIN"
                        class="text-primary font-medium"
                    >{{ useT('register.description.link') }}</ULink>.
                </template>
            </UAuthForm>
        </UPageCard>
    </div>
</template>

<script lang="ts" setup>
import * as z from 'zod';
import type { FormSubmitEvent, AuthFormField } from '@nuxt/ui';
import { ERoutes } from '~/utils/enum/Routes.enum';

const fields: AuthFormField[] = [{
    name: 'name',
    type: 'text',
    label: useT('register.fields.name.label'),
    placeholder: useT('register.fields.name.placeholder'),
    required: true
}, {
    name: 'email',
    type: 'email',
    label: useT('register.fields.email.label'),
    placeholder: useT('register.fields.email.placeholder'),
    required: true
}, {
    name: 'password',
    label: useT('register.fields.password.label'),
    type: 'password',
    placeholder: useT('register.fields.password.placeholder'),
    required: true
}];

const schema = z.object({
    name: z.string(useT('register.fields.errors.required')),
    email: z.email(useT('register.fields.errors.invalidEmail')),
    password: z.string(useT('register.fields.errors.required')).min(Security.MIN_PASSWORD_LENGTH, useT('register.fields.errors.passwordMinLength', { min: Security.MIN_PASSWORD_LENGTH }))
});

type Schema = z.output<typeof schema>;

async function onSubmit(payload: FormSubmitEvent<Schema>) {
    try {
        await $fetch('/api/auth/register', {
            method: 'POST',
            body: payload.data
        });

        await useUserSession().fetch();
        await navigateTo(ERoutes.LOGIN, { replace: true });
    } catch (err) {
        console.error(err);
    }
}
</script>
