import '@ant-design/v5-patch-for-react-19';
import { ConfigProvider } from 'antd';
import { getMessages } from 'next-intl/server';
import { NextIntlClientProvider } from 'next-intl';
import ReactQueryProvider from '@/provider/ReactQueryProvider';
import { cookies } from 'next/headers';
import { NuqsAdapter } from 'nuqs/adapters/next/app';

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // Get locale from cookie (server-side)
  const cookieStore = await cookies();
  const locale = cookieStore.get('locale')?.value || 'en';

  // Get messages for current locale
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body>
        <ConfigProvider
          theme={{
            token: {
              colorPrimary: '#1677ff',
              borderRadius: 6,
            },
          }}
        >
          <NextIntlClientProvider locale={locale} messages={messages}>
            <ReactQueryProvider>
              <NuqsAdapter>{children} </NuqsAdapter>
            </ReactQueryProvider>
          </NextIntlClientProvider>
        </ConfigProvider>
      </body>
    </html>
  );
}
