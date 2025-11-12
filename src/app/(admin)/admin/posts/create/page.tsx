'use client';

import React, { useState } from 'react';
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

const { TextArea } = Input;
const { Title, Text } = Typography;

export default function CreatePostPage() {
  const [form] = Form.useForm();
  const router = useRouter();
  const [messageApi, contextHolder] = message.useMessage();

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
  React.useEffect(() => {
    if (isError) {
      messageApi.error(`Không thể tải danh mục: ${error?.message || 'Lỗi không xác định'}`);
    }
  }, [isError, error, messageApi]);

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setThumbnailPreview(url);
  };

  const handleSubmit = async (values: any) => {
    if (!currentUser?.id) {
      messageApi.error('Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại!');
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
        slug: 'slug',
        thumbnail: values.thumbnail,
        category_id: values.category_id,
        creator_id: currentUser.id,
      };

      console.log('🚀 Created post payload:', payload.category_id);
      await createPostMutation.mutateAsync(payload);
      messageApi.success('Tạo bài viết thành công!');

      setTimeout(() => {
        router.push('/admin/posts');
      }, 1000);
    } catch (error: any) {
      messageApi.error(error.response?.data?.message || 'Tạo bài viết thất bại!');
    }
  };

  return (
    <>
      {contextHolder}

      <div style={{ minHeight: '100vh', background: '#f4f6f9', padding: '24px 16px' }}>
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
                  Quay lại
                </Button>
                <Title level={4} style={{ margin: 0, color: '#1a1a1a' }}>
                  Tạo bài viết mới
                </Title>
              </Space>
            </div>

            {/* Form Body */}
            <div style={{ padding: '32px', maxHeight: 'calc(100vh - 180px)', overflowY: 'auto' }}>
              <Form form={form} layout="vertical" onFinish={handleSubmit} size="large">
                {/* === TIÊU ĐỀ & MÔ TẢ - 2 CỘT === */}
                <Row gutter={24}>
                  {/* Tiếng Việt */}
                  <Col xs={24} lg={12}>
                    <div style={{ marginBottom: 24 }}>
                      <div
                        style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}
                      >
                        <Text strong style={{ fontSize: 16 }}>
                          Tiếng Việt
                        </Text>
                        <span
                          style={{
                            background: '#ff4d4f',
                            color: '#fff',
                            fontSize: 11,
                            padding: '2px 6px',
                            borderRadius: 4,
                          }}
                        >
                          BẮT BUỘC
                        </span>
                      </div>

                      <Form.Item
                        label="Tiêu đề"
                        name="title_vi"
                        rules={[{ required: true, message: 'Vui lòng nhập tiêu đề!' }]}
                      >
                        <Input placeholder="Nhập tiêu đề bài viết..." />
                      </Form.Item>

                      <Form.Item
                        label="Mô tả ngắn (150-200 ký tự)"
                        name="description_vi"
                        rules={[{ required: true, message: 'Vui lòng nhập mô tả!' }]}
                      >
                        <TextArea
                          rows={3}
                          placeholder="Tóm tắt nội dung..."
                          showCount
                          maxLength={200}
                        />
                      </Form.Item>

                      <Form.Item
                        label="Nội dung chi tiết"
                        name="content_vi"
                        rules={[{ required: true, message: 'Vui lòng nhập nội dung!' }]}
                      >
                        <TextArea rows={6} placeholder="Viết nội dung chi tiết..." showCount />
                      </Form.Item>
                    </div>
                  </Col>

                  {/* Tiếng Anh */}
                  <Col xs={24} lg={12}>
                    <div style={{ marginBottom: 24 }}>
                      <div
                        style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}
                      >
                        <Text strong style={{ fontSize: 16 }}>
                          English
                        </Text>
                        <span
                          style={{
                            background: '#1890ff',
                            color: '#fff',
                            fontSize: 11,
                            padding: '2px 6px',
                            borderRadius: 4,
                          }}
                        >
                          TÙY CHỌN
                        </span>
                      </div>

                      <Form.Item label="Title" name="title_en">
                        <Input placeholder="Enter title in English..." />
                      </Form.Item>

                      <Form.Item label="Short Description" name="description_en">
                        <TextArea
                          rows={3}
                          placeholder="Brief summary..."
                          showCount
                          maxLength={200}
                        />
                      </Form.Item>

                      <Form.Item label="Content" name="content_en">
                        <TextArea rows={6} placeholder="Write detailed content..." showCount />
                      </Form.Item>
                    </div>
                  </Col>
                </Row>

                <Divider style={{ margin: '32px 0' }} />

                {/* === DANH MỤC & THUMBNAIL === */}
                <Row gutter={24}>
                  <Col xs={24} md={12}>
                    <Form.Item
                      label="Danh mục"
                      name="category_id"
                      rules={[{ required: true, message: 'Vui lòng chọn danh mục!' }]}
                    >
                      <Select
                        loading={loadingCats}
                        placeholder="Chọn danh mục..."
                        showSearch
                        optionFilterProp="children"
                        notFoundContent={isError ? 'Lỗi tải danh mục' : 'Không có dữ liệu'}
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
                      label="Thumbnail URL"
                      name="thumbnail"
                      rules={[
                        { required: true, message: 'Vui lòng nhập URL!' },
                        { type: 'url', message: 'URL không hợp lệ!' },
                      ]}
                      extra="Khuyến nghị: 1200x630px"
                    >
                      <Input
                        placeholder="https://example.com/image.jpg"
                        onChange={handleThumbnailChange}
                        suffix={<EyeOutlined style={{ color: '#aaa' }} />}
                      />
                    </Form.Item>
                  </Col>
                </Row>

                {/* Preview */}
                {thumbnailPreview && (
                  <div style={{ marginTop: 16, textAlign: 'center' }}>
                    <Text strong>Preview:</Text>
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
                      Hủy
                    </Button>
                    <Button
                      type="primary"
                      htmlType="submit"
                      size="large"
                      icon={<SaveOutlined />}
                      loading={createPostMutation.isPending}
                      style={{ minWidth: 140 }}
                    >
                      Tạo bài viết
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
