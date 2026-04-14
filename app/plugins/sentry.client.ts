import * as Sentry from '@sentry/browser';

export default defineNuxtPlugin({
    name: 'sentry',
    parallel: true,
    setup() {
        const {
            public: { sentry },
        } = useRuntimeConfig();

        const dsn = sentry?.dsn;
        if (!dsn) {
            return;
        }

        Sentry.init({
            dsn,
            environment: process.env.NODE_ENV,
            integrations: [],
        });
    }
});
