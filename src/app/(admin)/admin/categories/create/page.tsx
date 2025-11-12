'use client';

import React from 'react';
import { Card, Form, Input, Button, message, Space, InputNumber } from 'antd';
import { ArrowLeftOutlined, SaveOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { categoryService } from '@/service/categoryService';
import { useAuthStore } from '@/store/authStore'; // import auth store

export default function CreateCategoryPage() {
  const [form] = Form.useForm();
  const router = useRouter();
  const [messageApi, contextHolder] = message.useMessage();
  const { currentUser } = useAuthStore(); // Lấy user hiện tại

  const handleSubmit = async (values: any) => {
    if (!currentUser?.id) {
      messageApi.error('Không xác định người tạo danh mục!');
      return;
    }

    try {
      // gán creator_id trước khi gửi
      const payload = {
        ...values,
        creator_id: currentUser.id,
      };

      await categoryService.createCategory(payload);
      messageApi.success('Tạo danh mục thành công!');
      router.push('/admin/categories');
    } catch (error: any) {
      messageApi.error(error.response?.data?.message || 'Tạo thất bại');
    }
  };

  return (
    <>
      {contextHolder}
      <div style={{ minHeight: '100vh', background: '#f0f2f5', padding: '24px 16px' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <Card
            title={
              <Space>
                <Button
                  icon={<ArrowLeftOutlined />}
                  onClick={() => router.push('/admin/categories')}
                >
                  Quay lại
                </Button>
                <span style={{ fontSize: 18, fontWeight: 600 }}>Tạo danh mục mới</span>
              </Space>
            }
          >
            <div style={{ maxHeight: 'calc(100vh - 260px)', overflowY: 'auto', paddingRight: 8 }}>
              <Form form={form} layout="vertical" onFinish={handleSubmit}>
                {/* === TIẾNG VIỆT === */}
                <div
                  style={{
                    background: '#fff7e6',
                    padding: 16,
                    borderRadius: 8,
                    marginBottom: 24,
                    border: '1px solid #ffd8b0',
                  }}
                >
                  <strong style={{ color: '#d4380d', fontSize: 15 }}>Tiếng Việt (bắt buộc)</strong>
                  <Form.Item
                    label="Tên danh mục"
                    name="name_vi"
                    rules={[{ required: true, message: 'Vui lòng nhập tên tiếng Việt!' }]}
                  >
                    <Input size="large" placeholder="VD: Tin tức, Sự kiện..." />
                  </Form.Item>
                </div>

                {/* === TIẾNG ANH === */}
                <div
                  style={{
                    background: '#e6f7ff',
                    padding: 16,
                    borderRadius: 8,
                    marginBottom: 24,
                    border: '1px solid #91d5ff',
                  }}
                >
                  <strong style={{ color: '#1890ff', fontSize: 15 }}>Tiếng Anh (tùy chọn)</strong>
                  <Form.Item label="Tên danh mục" name="name_en">
                    <Input size="large" placeholder="VD: News, Events..." />
                  </Form.Item>
                </div>

                {/* === SLUG === */}
                <div
                  style={{
                    background: '#f6ffed',
                    padding: 16,
                    borderRadius: 8,
                    marginBottom: 24,
                    border: '1px solid #b7eb8f',
                  }}
                >
                  <strong style={{ color: '#389e0d', fontSize: 15 }}>Slug (bắt buộc)</strong>
                  <Form.Item
                    label="Slug"
                    name="slug"
                    rules={[{ required: true, message: 'Vui lòng nhập slug!' }]}
                  >
                    <Input size="large" placeholder="VD: tin-tuc, su-kien..." />
                  </Form.Item>
                </div>

                {/* === ORDER === */}
                <div
                  style={{
                    background: '#fff0f6',
                    padding: 16,
                    borderRadius: 8,
                    marginBottom: 24,
                    border: '1px solid #ffadd2',
                  }}
                >
                  <strong style={{ color: '#c41d7f', fontSize: 15 }}>Thứ tự (Order)</strong>
                  <Form.Item
                    label="Thứ tự"
                    name="order"
                    rules={[{ required: true, message: 'Vui lòng nhập thứ tự!' }]}
                  >
                    <InputNumber size="large" min={1} style={{ width: '100%' }} />
                  </Form.Item>
                </div>

                {/* === NÚT === */}
                <Form.Item>
                  <Space size="middle">
                    <Button type="primary" htmlType="submit" icon={<SaveOutlined />} size="large">
                      Tạo danh mục
                    </Button>
                    <Button size="large" onClick={() => router.push('/admin/categories')}>
                      Hủy
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
