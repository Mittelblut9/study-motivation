import * as Sentry from '@sentry/nuxt';
import { useRuntimeConfig } from 'nuxt/dist/app/nuxt';

Sentry.init({
    dsn: useRuntimeConfig().public.sentry.dsn || '',
    enableLogs: true,

    // Enable sending of user PII (Personally Identifiable Information)
    // https://docs.sentry.io/platforms/javascript/guides/nuxt/configuration/options/#sendDefaultPii
    sendDefaultPii: true,
    debug: false,
});
