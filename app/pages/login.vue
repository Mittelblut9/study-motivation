<template>
    <div class="flex flex-col items-center justify-center gap-4 p-4">
        <UPageCard class="w-full max-w-md">
            <UAuthForm
                :schema="schema"
                :title="useT('login.title')"
                :description="useT('login.description')"
                icon="i-lucide-user"
                :fields="fields"
                @submit="onSubmit"
            />
        </UPageCard>
    </div>
</template>

<script lang="ts" setup>
import * as z from 'zod';
import type { FormSubmitEvent, AuthFormField } from '@nuxt/ui';

const fields: AuthFormField[] = [{
    name: 'email',
    type: 'email',
    label: useT('login.fields.email.label'),
    placeholder: useT('login.fields.email.placeholder'),
    required: true
}, {
    name: 'password',
    label: useT('login.fields.password.label'),
    type: 'password',
    placeholder: useT('login.fields.password.placeholder'),
    required: true
}, {
    name: 'remember',
    label: useT('login.fields.remember.label'),
    type: 'checkbox'
}];

const schema = z.object({
    email: z.email(useT('login.fields.errors.invalidEmail')),
    password: z.string(useT('login.fields.errors.required')).min(Security.MIN_PASSWORD_LENGTH, useT('login.fields.errors.passwordMinLength', { min: Security.MIN_PASSWORD_LENGTH }))
});

type Schema = z.output<typeof schema>;

function onSubmit(payload: FormSubmitEvent<Schema>) {
    $fetch('/api/auth', {
        method: 'POST',
        body: payload.data
    }).then((data) => {
        console.log('Login successful:', data);
        // navigateTo('/');
    }).catch((err) => {
        console.error(err);
    });
}
</script>
