import { generateJsonTranslations } from './scripts/i18n/loadYamlTranslations';
import { ERoutes } from './app/utils/enum/Routes.enum';

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    modules: [
        '@nuxtjs/i18n',
        '@nuxt/ui',
        '@nuxt/image',
        '@nuxt/fonts',
        '@sentry/nuxt/module',
        '@nuxtjs/seo',
        '@nuxt/eslint',
        'nuxt-auth-utils',
    ],
    plugins: [
        '~/plugins/sentry.ts',
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
            title: 'Nuxt 3 Template',
        },
    },
    css: [
        '~/assets/css/main.css',
        '~/assets/scss/base.scss',
    ],
    colorMode: {
        preference: 'light',
        storage: 'cookie',
        storageKey: 'study-motivation-color-mode',
    },
    runtimeConfig: {
        db: {
            path: 'study-motivation.db',
        },
    },
    extensions: ['ts', 'js'],
    routeRules: {
        [ERoutes.HOME]: {
            appMiddleware: ['auth'],
        }
    },
    devServer: {
        url: 'http://127.0.0.1:3000',
    },
    future: {
        compatibilityVersion: 4,
    },
    compatibilityDate: '2026-04-11',
    nitro: {
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
});
