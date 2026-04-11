import * as Sentry from '@sentry/nuxt';

export default defineNuxtPlugin({
    name: 'sentry',
    parallel: true,
    setup() {
        const {
            public: { sentryDsn },
        } = useRuntimeConfig();

        if (sentryDsn === '') {
            return;
        }

        Sentry.init({
            dsn: sentryDsn,
            environment: process.env.NODE_ENV,
            integrations: [],
        });
    }
});
