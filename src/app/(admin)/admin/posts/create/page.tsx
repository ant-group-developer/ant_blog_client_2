'use client';

import React, { useState, useCallback } from 'react';
import {
  Card,
  Form,
  Input,
  Button,
  message,
  Space,
  Select,
  Image,
  Row,
  Col,
  Divider,
  Typography,
} from 'antd';
import { ArrowLeftOutlined, SaveOutlined, EyeOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { categoryService } from '@/service/categoryService';
import { useCreatePost } from '@/hooks/usePosts';
import { useAuthStore } from '@/store/authStore';
import { Category } from '@/types';
import { useTranslations } from 'next-intl';

const { TextArea } = Input;
const { Title, Text } = Typography;

interface CreatePostFormValues {
  title_vi: string;
  title_en?: string;
  description_vi: string;
  description_en?: string;
  content_vi: string;
  content_en?: string;
  slug?: string;
  thumbnail: string;
  category_id: string;
}

export default function CreatePostPage() {
  const [form] = Form.useForm();
  const router = useRouter();
  const [messageApi, contextHolder] = message.useMessage();
  const t = useTranslations('createPost');

  const {
    data: categoriesData,
    isLoading: loadingCats,
    isError,
    error,
  } = useQuery({
    queryKey: ['categories'],
    queryFn: () =>
      categoryService.getCategories({
        page: 1,
        pageSize: 100,
        keyword: '',
      }),
    staleTime: 1000 * 60,
  });

  const categories = categoriesData?.data || [];

  const createPostMutation = useCreatePost();
  const [thumbnailPreview, setThumbnailPreview] = useState<string>('');

  const { currentUser } = useAuthStore();

  // Hiển thị lỗi nếu không load được categories
  const showErrorMessage = useCallback(() => {
    if (isError) {
      messageApi.error(`${t('errorLoading')} ${error?.message || t('errorInvalid')}`);
    }
  }, [isError, error, messageApi, t]);

  React.useEffect(() => {
    showErrorMessage();
  }, [showErrorMessage]);

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setThumbnailPreview(url);
  };

  const handleSubmit = async (values: CreatePostFormValues) => {
    if (!currentUser?.id) {
      messageApi.error(t('loginError'));
      return;
    }

    try {
      const payload = {
        title_vi: values.title_vi,
        title_en: values.title_en || undefined,
        description_vi: values.description_vi,
        description_en: values.description_en || undefined,
        content_vi: values.content_vi,
        content_en: values.content_en || undefined,
        slug: values.slug,
        thumbnail: values.thumbnail,
        category_id: values.category_id,
        creator_id: currentUser.id,
      };

      await createPostMutation.mutateAsync(payload);
      messageApi.success(t('success'));

      setTimeout(() => {
        router.push('/admin/posts');
      }, 1000);
    } catch (error) {
      const errorMessage =
        error instanceof Error && 'response' in error
          ? (error as { response?: { data?: { message?: string } } }).response?.data?.message
          : undefined;
      messageApi.error(errorMessage || t('error'));
    }
  };

  return (
    <>
      {contextHolder}

      <div
        style={{
          minHeight: '100vh',
          background: '#f4f6f9',
          padding: '24px 16px',
        }}
      >
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <Card
            style={{
              borderRadius: 16,
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.08)',
              overflow: 'hidden',
            }}
            styles={{ body: { padding: 0 } }}
          >
            {/* Header */}
            <div
              style={{
                padding: '20px 32px',
                background: '#fff',
                borderBottom: '1px solid #f0f0f0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Space size="middle">
                <Button
                  icon={<ArrowLeftOutlined />}
                  onClick={() => router.push('/admin/posts')}
                  type="text"
                  size="large"
                >
                  {t('back')}
                </Button>
                <Title level={4} style={{ margin: 0, color: '#1a1a1a' }}>
                  {t('title')}
                </Title>
              </Space>
            </div>

            {/* Form Body */}
            <div
              style={{
                padding: '32px',
                maxHeight: 'calc(100vh - 180px)',
                overflowY: 'auto',
              }}
            >
              <Form form={form} layout="vertical" onFinish={handleSubmit} size="large">
                {/* === TIÊU ĐỀ & MÔ TẢ - 2 CỘT === */}
                <Row gutter={24}>
                  {/* Tiếng Việt */}
                  <Col xs={24} lg={12}>
                    <div style={{ marginBottom: 24 }}>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 8,
                          marginBottom: 16,
                        }}
                      >
                        <Text strong style={{ fontSize: 16 }}>
                          {t('vietnamese')}
                        </Text>
                      </div>

                      <Form.Item
                        label={t('titleLabel')}
                        name="title_vi"
                        rules={[{ required: true, message: t('requiredTitle') }]}
                      >
                        <Input placeholder={t('titlePlaceholder')} />
                      </Form.Item>

                      <Form.Item
                        label={t('descLabel')}
                        name="description_vi"
                        rules={[{ required: true, message: t('requiredDesc') }]}
                      >
                        <TextArea
                          rows={3}
                          placeholder={t('descPlaceholder')}
                          showCount
                          maxLength={200}
                        />
                      </Form.Item>

                      <Form.Item
                        label={t('contentLabel')}
                        name="content_vi"
                        rules={[
                          {
                            required: true,
                            message: t('requiredContent'),
                          },
                        ]}
                      >
                        <TextArea rows={6} placeholder={t('contentPlaceholder')} showCount />
                      </Form.Item>
                    </div>
                  </Col>

                  {/* Tiếng Anh */}
                  <Col xs={24} lg={12}>
                    <div style={{ marginBottom: 24 }}>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 8,
                          marginBottom: 16,
                        }}
                      >
                        <Text strong style={{ fontSize: 16 }}>
                          {t('english')}
                        </Text>
                      </div>

                      <Form.Item
                        label={t('titleLabel')}
                        name="title_en"
                        rules={[{ required: true, message: t('requiredTitle') }]}
                      >
                        <Input placeholder={t('titlePlaceholder')} />
                      </Form.Item>

                      <Form.Item
                        label={t('contentLabel')}
                        name="content_en"
                        rules={[
                          {
                            required: true,
                            message: t('requiredContent'),
                          },
                        ]}
                      >
                        <TextArea rows={6} placeholder={t('contentPlaceholder')} showCount />
                      </Form.Item>
                    </div>
                  </Col>
                </Row>

                <Divider style={{ margin: '32px 0' }} />
                <Form.Item label="Slug" name="slug">
                  <Input placeholder={t('requiredSlug')} />
                </Form.Item>

                {/* === DANH MỤC & THUMBNAIL === */}
                <Row gutter={24}>
                  <Col xs={24} md={12}>
                    <Form.Item
                      label={t('categoryLabel')}
                      name="category_id"
                      rules={[{ required: true, message: t('requiredCategory') }]}
                    >
                      <Select
                        loading={loadingCats}
                        placeholder={t('categoryPlaceholder')}
                        showSearch
                        optionFilterProp="children"
                        notFoundContent={isError ? t('errorLoading') : t('noData')}
                      >
                        {categories.map((cat: Category) => (
                          <Select.Option key={cat.id} value={cat.id}>
                            {cat.name_vi} {cat.name_en && `(${cat.name_en})`}
                          </Select.Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={12}>
                    <Form.Item
                      label={t('thumbnailLabel')}
                      name="thumbnail"
                      rules={[
                        { required: true, message: t('requiredThumbnail') },
                        { type: 'url', message: t('invalidUrl') },
                      ]}
                      extra={t('thumbnailExtra')}
                    >
                      <Space.Compact style={{ width: '100%' }}>
                        <Input
                          placeholder="https://example.com/image.jpg"
                          onChange={handleThumbnailChange}
                          suffix={<EyeOutlined style={{ color: '#aaa' }} />}
                        />
                      </Space.Compact>
                    </Form.Item>
                  </Col>
                </Row>

                {/* Preview */}
                {thumbnailPreview && (
                  <div style={{ marginTop: 16, textAlign: 'center' }}>
                    <Text strong>{t('preview')}</Text>
                    <div
                      style={{
                        marginTop: 8,
                        display: 'inline-block',
                        borderRadius: 12,
                        overflow: 'hidden',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                      }}
                    >
                      <Image
                        src={thumbnailPreview}
                        alt="Preview"
                        width={400}
                        style={{ display: 'block', objectFit: 'cover' }}
                        fallback="https://via.placeholder.com/1200x630/eeeeee/999999?text=No+Image"
                      />
                    </div>
                  </div>
                )}

                <Divider style={{ margin: '32px 0 24px' }} />

                {/* === NÚT HÀNH ĐỘNG === */}
                <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
                  <Space size="middle">
                    <Button
                      size="large"
                      onClick={() => router.push('/admin/posts')}
                      disabled={createPostMutation.isPending}
                    >
                      {t('cancel')}
                    </Button>
                    <Button
                      type="primary"
                      htmlType="submit"
                      size="large"
                      icon={<SaveOutlined />}
                      loading={createPostMutation.isPending}
                      style={{ minWidth: 140 }}
                    >
                      {t('submit')}
                    </Button>
                  </Space>
                </Form.Item>
              </Form>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}
