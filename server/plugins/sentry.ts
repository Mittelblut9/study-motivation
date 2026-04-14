import * as Sentry from '@sentry/node';

export default defineNitroPlugin((nitroApp) => {
    const {
        public: { sentry },
    } = useRuntimeConfig();

    const dsn = sentry?.dsn;
    if (!dsn) {
        console.warn('Sentry DSN not set, skipping Sentry initialization');
        return;
    }

    Sentry.init({
        dsn: dsn || '',
        environment: process.env.NODE_ENV,
        tracesSampleRate: 0.25,
        profilesSampleRate: 0.25,
    });

    nitroApp.hooks.hook('error', (error) => {
        Sentry.captureException(error);
    });
    nitroApp.hooks.hook('request', (event) => {
        event.context.$sentry = Sentry;
    });

    nitroApp.hooks.hookOnce('close', async () => {
        await Sentry.close(2000);
    });
});
