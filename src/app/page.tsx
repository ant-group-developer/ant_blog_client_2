// app/(public)/posts/page.tsx
'use client';

import React, { use } from 'react';
import { Button, Typography } from 'antd';
import { ArrowRightOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { PageContainer } from '@ant-design/pro-components';
import { useTranslations } from 'next-intl';
const { Title, Paragraph } = Typography;

export default function PostLandingPage() {
  const router = useRouter();
  const t = useTranslations('home');
  const handleExplore = () => {
    router.push('/posts');
  };

  return (
    <PageContainer
      header={{ title: false }}
      className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center"
      style={{ padding: 0 }}
    >
      {/* Nền trang trí */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div
          className="absolute top-0 left-0 w-96 h-96 bg-purple-300 rounded-full blur-3xl opacity-30"
          style={{ transform: 'translate(-50%, -50%)' }}
        />
        <div
          className="absolute bottom-0 right-0 w-96 h-96 bg-pink-300 rounded-full blur-3xl opacity-30"
          style={{ transform: 'translate(50%, 50%)' }}
        />
      </div>

      <div className="flex flex-col items-center justify-center w-full px-6 md:px-12 lg:px-20">
        <div className="w-full max-w-3xl text-center space-y-8 mx-auto">
          {/* Tiêu đề */}
          <Title
            level={1}
            className="text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight"
            style={{
              background: 'linear-gradient(to right, #6366f1, #a855f7)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            {t('title')}
          </Title>

          {/* Mô tả */}
          <div className="space-y-5 max-w-4xl mx-auto">
            <Paragraph className="text-lg md:text-xl lg:text-2xl text-gray-700 leading-relaxed">
              {t('subtitle')}
            </Paragraph>
            <Paragraph className="text-lg md:text-xl lg:text-2xl text-gray-700 leading-relaxed font-medium">
              {t('subtitle_1')}
            </Paragraph>
            <Paragraph className="text-lg md:text-xl lg:text-2xl text-indigo-600 font-bold leading-relaxed">
              {t('subtitle_2')}
            </Paragraph>
          </div>

          <Button
            type="primary"
            size="large"
            icon={<ArrowRightOutlined />}
            onClick={handleExplore}
            className="h-16 px-12 text-xl font-semibold rounded-2xl shadow-xl flex items-center mx-auto transition-all duration-300 hover:shadow-2xl hover:scale-105"
            style={{
              background: 'linear-gradient(to right, #6366f1, #a855f7)',
              border: 'none',
              boxShadow: '0 12px 30px rgba(99, 102, 241, 0.35)',
            }}
          >
            {t('getStarted')}
          </Button>
        </div>
      </div>
    </PageContainer>
  );
}
