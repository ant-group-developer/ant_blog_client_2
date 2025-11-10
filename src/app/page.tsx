'use client';

import { Card, Typography, Space, Tag, Divider } from 'antd';
import { useTranslations, useLocale } from 'next-intl';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { GlobalOutlined, TranslationOutlined } from '@ant-design/icons';
import PostsPage from './(admin)/admin/posts/page';

const { Title, Paragraph, Text } = Typography;

export default function HomePage() {
  const t = useTranslations('home');
  const locale = useLocale();

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        padding: '40px 20px',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      <div style={{ maxWidth: 700, margin: '0 auto' }}>
        {/* Card chính */}
        <Card
          hoverable
          style={{
            borderRadius: 16,
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)',
            overflow: 'hidden',
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
          }}
        >
          {/* Header: Icon + Title */}
          <Space direction="vertical" size="middle" style={{ width: '100%', textAlign: 'center' }}>
            <div style={{ fontSize: 48, color: '#1677ff' }}>
              <TranslationOutlined />
            </div>

            <Title level={1} style={{ margin: 0, fontWeight: 700, color: '#1a1a1a' }}>
              {t('title')}
            </Title>

            <Paragraph
              style={{
                fontSize: 17,
                color: '#595959',
                maxWidth: 600,
                margin: '16px auto 0',
                lineHeight: 1.7,
              }}
            >
              {t('description')}
            </Paragraph>
          </Space>

          <Divider style={{ margin: '32px 0', borderColor: '#f0f0f0' }} />

          {/* Language Switcher */}
          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <LanguageSwitcher />
          </div>

          {/* Footer Info */}
          <Space direction="vertical" size="small" style={{ width: '100%', textAlign: 'center' }}>
            <Text type="secondary" style={{ fontSize: 14 }}>
              <GlobalOutlined style={{ marginRight: 6 }} />
              Ngôn ngữ hiện tại:{' '}
              <Tag color={locale === 'vi' ? 'volcano' : 'geekblue'} style={{ marginLeft: 4 }}>
                {locale.toUpperCase()}
              </Tag>
            </Text>

            <Text type="secondary" style={{ fontSize: 12, color: '#aaa' }}>
              Cookie:{' '}
              <code style={{ background: '#f5f5f5', padding: '2px 6px', borderRadius: 4 }}>
                locale={locale}
              </code>
            </Text>
          </Space>
        </Card>

        {/* Footer nhỏ */}
        <div style={{ textAlign: 'center', marginTop: 40, color: '#999', fontSize: 14 }}>
          Powered by <strong>Next.js</strong> + <strong>next-intl</strong> +{' '}
          <strong>Ant Design</strong>
        </div>
      </div>
    </div>
  );
}
