import { generateJsonTranslations } from './scripts/i18n/loadYamlTranslations';
import { ERoutes } from './app/utils/enum/Routes.enum';

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    modules: [
        '@nuxtjs/i18n',
        '@nuxt/ui',
        '@nuxt/image',
        '@nuxt/fonts',
        '@nuxtjs/seo',
        '@nuxt/eslint',
        'nuxt-auth-utils',
        'nuxt-security',
    ],

    plugins: [
        '~/plugins/sentry.client.ts',
    ],

    ssr: true,

    components: [
        {
            path: '~/components',
            pathPrefix: false,
        },
    ],

    imports: {
        dirs: [
            'composables/**',
            'utils/**',
        ]
    },

    devtools: { enabled: true },

    app: {
        head: {
            charset: 'utf-8',
            viewport: 'width=device-width, initial-scale=1',
            title: 'Study Motivation',
        },
    },

    css: [
        '~/assets/css/main.css',
        '~/assets/scss/base.scss',
    ],

    site: {
        name: 'Study Motivation',
        indexable: true,
        url: 'https://study.blackdayz.de'
    },

    colorMode: {
        preference: 'light',
        storage: 'cookie',
        storageKey: 'study-motivation-color-mode',
    },

    runtimeConfig: {
        db: {
            path: 'study-motivation.db',
        },
        session: {
            maxAge: 60 * 60 * 24 * 31,
        },
        public: {
            sentry: {
                dsn: process.env.SENTRY_DSN,
            }
        }
    },

    extensions: ['ts', 'js'],

    routeRules: {
        [ERoutes.HOME]: {
            appMiddleware: ['auth'],
        },
        [ERoutes.ADMIN]: {
            appMiddleware: ['auth'],
        }
    },

    sourcemap: {
        client: 'hidden',
    },

    devServer: {
        url: 'http://127.0.0.1:3000',
    },

    future: {
        compatibilityVersion: 4,
    },

    compatibilityDate: '2026-04-11',

    nitro: {
        plugins: [
            './plugins/sentry.ts',
        ],
        experimental: {
            tasks: true,
        },
        imports: {
            dirs: ['server/utils'],
            presets: [
                {
                    from: 'h3-zod',
                    imports: [
                        'useValidatedQuery',
                        'useValidatedBody',
                        'useValidatedParams',
                    ],
                },
                {
                    from: 'consola',
                    imports: ['consola'],
                },
            ],
        }
    },

    vite: {
        optimizeDeps: {
            include: []
        }
    },

    typescript: {
        typeCheck: false,
        strict: false,
        tsConfig: {
            exclude: ['node_modules'],
        },
        shim: true,
    },

    hooks: {
        'build:before': () => {
            generateJsonTranslations();
        },
        'webpack:change': () => {
            generateJsonTranslations();
        },
        'builder:watch': () => {
            generateJsonTranslations();
        },
    },

    auth: {
        hash: {
            scrypt: {
                cost: 16384,
                blockSize: 8,
                parallelization: 1,
            }
        }
    },

    i18n: {
        langDir: 'locales/.generated/',
        strategy: 'no_prefix',
        defaultLocale: 'de-DE',
        locales: [
            {
                code: 'de-DE',
                language: 'de-DE',
                name: 'Deutsch',
                file: 'de-DE.json',
            },
        ],
        compilation: {
            escapeHtml: false,
            strictMessage: false
        }
    },

    ogImage: {
        enabled: false
    },

    security: {
        rateLimiter: {
            interval: 1000 * 20,
            tokensPerInterval: 10,
            whiteList: ['127.0.0.1', 'localhost'],
        },
        hidePoweredBy: true,
        removeLoggers: true,
    },

    sentry: {
        org: 'blackdayz',
        project: 'study-page',
    },
    sitemap: {
        include: ['/', '/auth/login', '/auth/register'],
    },
});
