'use client';

import { Button, Space } from 'antd';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { useTransition } from 'react';

export default function LanguageSwitcher() {
  const router = useRouter();
  const locale = useLocale(); // 'en' | 'vi'
  const [isPending, startTransition] = useTransition();

  const setLocale = (newLocale: 'en' | 'vi') => {
    document.cookie = `locale=${newLocale}; path=/; max-age=${365 * 24 * 60 * 60}`;
    startTransition(() => {
      router.refresh();
    });
  };

  return (
    <Space>
      <Button
        type={locale === 'en' ? 'primary' : 'default'}
        onClick={() => setLocale('en')}
        disabled={isPending}
        style={{ minWidth: 80 }}
      >
        EN
      </Button>
      <Button
        type={locale === 'vi' ? 'primary' : 'default'}
        onClick={() => setLocale('vi')}
        disabled={isPending}
        style={{ minWidth: 80 }}
      >
        VI
      </Button>
    </Space>
  );
}
