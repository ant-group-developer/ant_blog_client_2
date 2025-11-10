import { ConfigProvider } from 'antd';
import { NextIntlClientProvider } from 'next-intl';
import ReactQueryProvider from '@/provider/ReactQueryProvider';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ConfigProvider
          theme={{
            token: {
              colorPrimary: '#1677ff',
              borderRadius: 6,
            },
          }}
        >
          <NextIntlClientProvider>
            <ReactQueryProvider>{children}</ReactQueryProvider>
          </NextIntlClientProvider>
        </ConfigProvider>
      </body>
    </html>
  );
}
