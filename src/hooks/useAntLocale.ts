'use client';

import { useLocale } from 'next-intl';
import enUS from '@/locales/antd/en_US';
import viVN from '@/locales/antd/vi_VN';
import type { Locale } from 'antd/es/locale';

export const useAntdLocale = (): Locale => {
  const locale = useLocale();

  switch (locale) {
    case 'vi':
      return viVN;
    case 'en':
    default:
      return enUS;
  }
};
