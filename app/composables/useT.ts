import type { NamedValue } from '@intlify/core-base';

export const useT = (key: string | number, named: NamedValue = {}): string => {
    const { $i18n } = useNuxtApp();
    return $i18n.t(key, named);
};
