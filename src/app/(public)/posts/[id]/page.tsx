// app/(public)/posts/[id]/page.tsx
'use client';

import React, { use } from 'react';
import { Card, Typography, Tag, Button, Spin, Space, Avatar, Divider } from 'antd';
import {
  ArrowLeftOutlined,
  CalendarOutlined,
  UserOutlined,
  EyeOutlined,
  ClockCircleOutlined,
  FileTextOutlined,
} from '@ant-design/icons';
import { useParams, useRouter } from 'next/navigation';
import { usePostById } from '@/hooks/usePosts';
import { useQuery } from '@tanstack/react-query';
import { categoryService } from '@/service/categoryService';
import type { Category } from '@/types';
import { useTranslations } from 'next-intl';

const { Title, Paragraph, Text } = Typography;

export default function PostDetailPage() {
  const params = useParams();
  const router = useRouter();
  const postId = params?.id as string;
  const t = useTranslations('detailPost');

  const { data: post, isLoading: loadingPost, isError } = usePostById(postId);

  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoryService.getCategories({ page: 1, pageSize: 100 }),
    staleTime: 1000 * 60,
  });
  const categories: Category[] = categoriesData?.data || [];
  const categoryMap = new Map<string, string>();
  categories.forEach((c) => categoryMap.set(c.id, c.name_vi));

  if (loadingPost) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        }}
      >
        <Card style={{ minWidth: 300, textAlign: 'center' }}>
          <Spin size="large" />
          <div style={{ marginTop: 16 }}>
            <Text type="secondary">{t('loadingText')}</Text>
          </div>
        </Card>
      </div>
    );
  }

  if (isError || !post || post.message) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#f0f2f5',
          padding: '24px',
        }}
      >
        <Card style={{ maxWidth: 500, textAlign: 'center' }}>
          <FileTextOutlined style={{ fontSize: 64, color: '#ff4d4f', marginBottom: 16 }} />
          <Title level={3}>{t('notFoundTitle')}</Title>
          <Paragraph type="secondary">{post?.message || t('notFoundDesc')}</Paragraph>
          <Button
            type="primary"
            size="large"
            icon={<ArrowLeftOutlined />}
            onClick={() => router.push('/posts')}
          >
            {t('backToList')}
          </Button>
        </Card>
      </div>
    );
  }

  const categoryName = categoryMap.get(post.category_id) || t('defaultCategory');
  const formattedDate = post.created_at
    ? new Date(post.created_at).toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : '';

  return (
    <div style={{ minHeight: '100vh', background: '#f8f9fa' }}>
      {/* Back button - Fixed */}
      <div style={{ position: 'absolute', top: 100, left: 100, zIndex: 1000 }}>
        <Button
          type="text"
          icon={<ArrowLeftOutlined />}
          style={{
            color: 'white',
            background: 'rgba(0,0,0,0.5)',
            backdropFilter: 'blur(10px)',
            fontWeight: 500,
          }}
          onClick={() => router.push('/posts')}
        >
          {t('back')}
        </Button>
      </div>

      {/* 1. Thumbnail Image Hero */}
      <div
        style={{
          position: 'relative',
          height: '60vh',
          minHeight: 300,
          maxWidth: '70%',
          margin: '0 auto',
          borderRadius: 16,
          overflow: 'hidden',
          boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
        }}
      >
        {post.thumbnail && (
          <img
            src={post.thumbnail}
            alt={post.title_vi}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        )}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.5))',
          }}
        />
      </div>

      {/* Content Card */}
      <div
        style={{
          maxWidth: 900,
          margin: '-80px auto 0',
          padding: '0 24px 80px',
          position: 'relative',
        }}
      >
        <Card
          style={{
            borderRadius: 16,
            boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
            border: 'none',
            overflow: 'hidden',
          }}
        >
          {/* 2. Danh mục */}
          <div style={{ padding: '32px 32px 0' }}>
            <Text
              type="secondary"
              style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: 1 }}
            >
              {t('categoryLabel')}
            </Text>
            <div style={{ marginTop: 12 }}>
              <Tag color="blue" style={{ fontSize: 14, padding: '6px 16px', borderRadius: 6 }}>
                {categoryName}
              </Tag>
            </div>
          </div>

          <Divider style={{ margin: '24px 0' }} />

          {/* 3. Tiêu đề */}
          <div style={{ padding: '0 32px' }}>
            <Text
              type="secondary"
              style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: 1 }}
            >
              {t('titleLabel')}
            </Text>
            <Title
              level={2}
              style={{
                marginTop: 12,
                marginBottom: 0,
                fontSize: 'clamp(24px, 4vw, 36px)',
                lineHeight: 1.3,
                color: '#1a1a1a',
              }}
            >
              {post.title_vi}
            </Title>
          </div>

          <Divider style={{ margin: '24px 0' }} />

          {/* 4. Thông tin bài viết */}
          <div style={{ padding: '0 32px' }}>
            <Text
              type="secondary"
              style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: 1 }}
            >
              {t('infoLabel')}
            </Text>
            <div style={{ marginTop: 12 }}>
              <Space size="large" wrap>
                <Space size="small">
                  <CalendarOutlined style={{ color: '#8c8c8c' }} />
                  <Text type="secondary">
                    {t('postedDate')}: {formattedDate}
                  </Text>
                </Space>
                <Space size="small">
                  <ClockCircleOutlined style={{ color: '#8c8c8c' }} />
                  <Text type="secondary">5 {t('readTime')}</Text>
                </Space>
                <Space size="small">
                  <EyeOutlined style={{ color: '#8c8c8c' }} />
                  <Text type="secondary">
                    {Math.floor(Math.random() * 1000)} {t('views')}
                  </Text>
                </Space>
              </Space>
            </div>
          </div>

          <Divider style={{ margin: '24px 0' }} />

          {/* 5. Mô tả ngắn */}
          {post.description_vi && (
            <>
              <div style={{ padding: '0 32px' }}>
                <Text
                  type="secondary"
                  style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: 1 }}
                >
                  {t('descriptionLabel')}
                </Text>
                <Paragraph
                  style={{
                    fontSize: 17,
                    lineHeight: 1.7,
                    color: '#595959',
                    fontStyle: 'italic',
                    marginTop: 12,
                    marginBottom: 0,
                    padding: '16px 20px',
                    background: '#f0f7ff',
                    borderRadius: 8,
                    borderLeft: '4px solid #1890ff',
                  }}
                >
                  {post.description_vi}
                </Paragraph>
              </div>
              <Divider style={{ margin: '24px 0' }} />
            </>
          )}

          {/* 6. Nội dung chính */}
          <div style={{ padding: '0 32px 32px' }}>
            <Text
              type="secondary"
              style={{
                fontSize: 12,
                textTransform: 'uppercase',
                letterSpacing: 1,
                marginBottom: 16,
                display: 'block',
              }}
            >
              {t('contentLabel')}
            </Text>
            <div
              style={{
                fontSize: 17,
                lineHeight: 1.9,
                color: '#262626',
                wordBreak: 'break-word',
                marginTop: 16,
              }}
            >
              {post.content_vi ? (
                <div style={{ whiteSpace: 'pre-wrap' }}>
                  {post.content_vi.split('\n').map((paragraph: string, idx: number) => {
                    if (paragraph.startsWith('# ')) {
                      return (
                        <Title
                          key={idx}
                          level={3}
                          style={{ marginTop: idx > 0 ? 32 : 0, marginBottom: 16 }}
                        >
                          {paragraph.replace('# ', '')}
                        </Title>
                      );
                    }
                    if (paragraph.startsWith('## ')) {
                      return (
                        <Title key={idx} level={4} style={{ marginTop: 24, marginBottom: 12 }}>
                          {paragraph.replace('## ', '')}
                        </Title>
                      );
                    }
                    if (paragraph.startsWith('- ')) {
                      return (
                        <li key={idx} style={{ marginLeft: 20, marginBottom: 8, lineHeight: 1.8 }}>
                          {paragraph.replace('- ', '')}
                        </li>
                      );
                    }
                    if (paragraph.includes('**')) {
                      const parts = paragraph.split('**');
                      return (
                        <Paragraph key={idx} style={{ marginBottom: 12 }}>
                          {parts.map((part: string, i: number) =>
                            i % 2 === 1 ? <strong key={i}>{part}</strong> : part
                          )}
                        </Paragraph>
                      );
                    }
                    if (paragraph.trim()) {
                      return (
                        <Paragraph key={idx} style={{ marginBottom: 12 }}>
                          {paragraph}
                        </Paragraph>
                      );
                    }
                    return <div key={idx} style={{ height: 8 }} />;
                  })}
                </div>
              ) : (
                <Paragraph type="secondary">{t('updatingContent')}</Paragraph>
              )}
            </div>
          </div>

          <Divider style={{ margin: 0 }} />

          {/* 7. Tác giả & Footer */}
          <div
            style={{
              padding: '24px 32px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              background: '#fafafa',
            }}
          >
            <div>
              <Text
                type="secondary"
                style={{
                  fontSize: 12,
                  textTransform: 'uppercase',
                  letterSpacing: 1,
                  display: 'block',
                  marginBottom: 12,
                }}
              >
                {t('authorLabel')}
              </Text>
              <Space>
                <Avatar size={48} icon={<UserOutlined />} style={{ background: '#1890ff' }} />
                <div>
                  <Text strong style={{ fontSize: 15, display: 'block' }}>
                    {t('authorName')}
                  </Text>
                  <Text type="secondary" style={{ fontSize: 13 }}>
                    {t('postedOn')} {formattedDate}
                  </Text>
                </div>
              </Space>
            </div>

            <Button type="primary" size="large" onClick={() => router.push('/posts')}>
              {t('morePosts')}
            </Button>
          </div>
        </Card>

        {/* Related Posts Section */}
        <div style={{ marginTop: 48 }}>
          <Title level={3} style={{ marginBottom: 16 }}>
            {t('relatedPosts')}
          </Title>
          <Card style={{ background: '#fff', borderRadius: 8 }}>
            <Text type="secondary">{t('relatedPlaceholder')}</Text>
          </Card>
        </div>
      </div>
    </div>
  );
}
