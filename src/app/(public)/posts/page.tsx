'use client';

import React, { useState } from 'react';
import { Card, Typography, Tag, Button, Input, Row, Col, Pagination, Spin, Space } from 'antd';
import { ReadOutlined, SearchOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { usePosts } from '@/hooks/usePosts';
import { useQuery } from '@tanstack/react-query';
import { categoryService } from '@/service/categoryService';
import type { Post, Category } from '@/types';
import { useTranslations } from 'next-intl';

const { Title, Paragraph } = Typography;
const { Search } = Input;

export default function PostsPage() {
  const [params, setParams] = useState({
    page: 1,
    pageSize: 9,
    keyword: '',
  });

  const t = useTranslations('post');

  const { data: postsData, isLoading: loadingPosts } = usePosts(params);
  const posts: Post[] = postsData?.data || [];
  const total = postsData?.total || 0;

  // === FETCH CATEGORIES ===
  const { data: categoriesData, isLoading: loadingCats } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoryService.getCategories({ page: 1, pageSize: 100 }),
    staleTime: 1000 * 60,
  });
  const categories: Category[] = categoriesData?.data || [];

  const categoryMap = new Map<string, string>();
  categories.forEach((c) => categoryMap.set(c.id, c.name_vi));

  // === HANDLERS ===
  const handleSearch = (value: string) => {
    setParams({ ...params, keyword: value, page: 1 });
  };

  const handlePageChange = (page: number, pageSize?: number) => {
    setParams({ ...params, page, pageSize: pageSize || 10 });
  };

  // === RENDER ===
  return (
    <div style={{ minHeight: '100vh', background: '#f8f9fa', padding: '40px 24px' }}>
      {/* Header Section */}
      <div style={{ textAlign: 'center', marginBottom: 48, maxWidth: 900, margin: '0 auto 48px' }}>
        <Title level={2} style={{ fontSize: 36, marginBottom: 12 }}>
          {t('latestPostsTitle')}
        </Title>
        <Paragraph type="secondary" style={{ fontSize: 16 }}>
          {t('latestPostsSubtitle')}
        </Paragraph>

        <div style={{ maxWidth: 500, margin: '24px auto 0' }}>
          <Space.Compact style={{ width: '100%', maxWidth: 500 }}>
            <Input
              placeholder={t('searchPlaceholder')}
              allowClear
              size="large"
              onPressEnter={(e) => handleSearch((e.target as HTMLInputElement).value)}
            />
            <Button
              type="primary"
              size="large"
              icon={<SearchOutlined />}
              onClick={() => {
                const input = document.querySelector<HTMLInputElement>('.ant-input')!;
                handleSearch(input.value);
              }}
            >
              {t('search')}
            </Button>
          </Space.Compact>
        </div>
      </div>

      {/* Content Container - Giới hạn width */}
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        {loadingPosts || loadingCats ? (
          <div style={{ textAlign: 'center', marginTop: 80 }}>
            <Spin size="large" />
          </div>
        ) : (
          <>
            <Row gutter={[30, 30]} justify="start">
              {posts.map((post) => (
                <Col xs={24} sm={12} md={8} lg={8} xl={8} key={post.id}>
                  <Card
                    hoverable
                    cover={
                      <div
                        style={{
                          height: 220,
                          overflow: 'hidden',
                          background: '#e8e8e8',
                        }}
                      >
                        <img
                          src={post.thumbnail || '/default-thumbnail.jpg'}
                          alt={post.title_vi}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            transition: 'transform 0.3s ease',
                          }}
                          onMouseOver={(e) => {
                            e.currentTarget.style.transform = 'scale(1.05)';
                          }}
                          onMouseOut={(e) => {
                            e.currentTarget.style.transform = 'scale(1)';
                          }}
                        />
                      </div>
                    }
                    style={{
                      borderRadius: 12,
                      overflow: 'hidden',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      transition: 'all 0.3s ease',
                    }}
                    styles={{
                      body: {
                        padding: '20px',
                        display: 'flex',
                        flexDirection: 'column',
                        flex: 1,
                      },
                    }}
                  >
                    <div style={{ marginBottom: 12 }}>
                      <Tag color="blue" style={{ borderRadius: 4 }}>
                        {categoryMap.get(post.category_id) || t('newsDefaultCategory')}
                      </Tag>
                    </div>

                    <Title
                      level={4}
                      style={{
                        marginTop: 0,
                        marginBottom: 12,
                        fontSize: 18,
                        lineHeight: 1.4,
                        minHeight: 50,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}
                    >
                      {post.title_vi}
                    </Title>

                    <Paragraph
                      ellipsis={{ rows: 3 }}
                      type="secondary"
                      style={{
                        marginBottom: 16,
                        flex: 1,
                        fontSize: 14,
                        lineHeight: 1.6,
                      }}
                    >
                      {post.description_vi || t('noDescription')}
                    </Paragraph>

                    <Link href={`/posts/${post.id}`} style={{ marginTop: 'auto' }}>
                      <Button
                        type="primary"
                        icon={<ReadOutlined />}
                        block
                        style={{ borderRadius: 6 }}
                      >
                        {t('readMore')}
                      </Button>
                    </Link>
                  </Card>
                </Col>
              ))}
            </Row>

            {/* PHÂN TRANG */}
            {total > 0 && (
              <div style={{ textAlign: 'center', marginTop: 48, paddingBottom: 24 }}>
                <Pagination
                  current={params.page}
                  pageSize={params.pageSize}
                  total={total}
                  showSizeChanger
                  pageSizeOptions={['6', '9', '12']}
                  onChange={handlePageChange}
                  showTotal={(total) => `${total} ${t('totalPosts')}`}
                />
              </div>
            )}

            {!loadingPosts && posts.length === 0 && (
              <Card style={{ textAlign: 'center', marginTop: 48, borderRadius: 12 }}>
                <div style={{ padding: '40px 20px' }}>
                  <SearchOutlined style={{ fontSize: 48, color: '#d9d9d9', marginBottom: 16 }} />
                  <Paragraph style={{ fontSize: 16, color: '#8c8c8c' }}>
                    {t('noResultsTitle')}
                  </Paragraph>
                  {params.keyword && (
                    <Button
                      type="primary"
                      onClick={() => setParams({ ...params, keyword: '', page: 1 })}
                    >
                      {t('clearFilter')}
                    </Button>
                  )}
                </div>
              </Card>
            )}
          </>
        )}
      </div>
    </div>
  );
}
