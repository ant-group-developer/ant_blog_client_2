'use client';

import React from 'react';
import { Card, Form, Input, Button, message, Space, InputNumber } from 'antd';
import { ArrowLeftOutlined, SaveOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { categoryService } from '@/service/categoryService';
import { useAuthStore } from '@/store/authStore';
import { useTranslations } from 'next-intl';

export default function CreateCategoryPage() {
  const [form] = Form.useForm();
  const router = useRouter();
  const [messageApi, contextHolder] = message.useMessage();
  const { currentUser } = useAuthStore();
  const t = useTranslations('categoryList');

  const handleSubmit = async (values: any) => {
    if (!currentUser?.id) {
      messageApi.error(t('unspecified'));
      return;
    }

    try {
      const payload = {
        ...values,
        creator_id: currentUser.id,
      };

      await categoryService.createCategory(payload);
      messageApi.success(t('createSuccess'));
      router.push('/admin/categories');
    } catch (error: any) {
      messageApi.error(error.response?.data?.message || t('createFailed'));
    }
  };

  return (
    <>
      {contextHolder}
      <div
        style={{
          minHeight: '100vh',
          background: '#f0f2f5',
          padding: '24px 16px',
        }}
      >
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <Card
            title={
              <Space>
                <Button
                  icon={<ArrowLeftOutlined />}
                  onClick={() => router.push('/admin/categories')}
                >
                  {t('back')}
                </Button>
                <span style={{ fontSize: 18, fontWeight: 600 }}>{t('createCategory')}</span>
              </Space>
            }
          >
            <div
              style={{
                maxHeight: 'calc(100vh - 260px)',
                overflowY: 'auto',
                paddingRight: 8,
              }}
            >
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
                  <strong style={{ color: '#d4380d', fontSize: 15 }}>{t('vi')}</strong>
                  <Form.Item
                    label={t('nameVi')}
                    name="name_vi"
                    rules={[
                      {
                        required: true,
                        message: t('validate'),
                      },
                    ]}
                  >
                    <Input size="large" placeholder="..." />
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
                  <strong style={{ color: '#1890ff', fontSize: 15 }}>{t('en')}</strong>
                  <Form.Item
                    label={t('nameEn')}
                    name="name_en"
                    rules={[
                      {
                        required: true,
                        message: t('validate'),
                      },
                    ]}
                  >
                    <Input size="large" placeholder="..." />
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
                  <strong style={{ color: '#389e0d', fontSize: 15 }}>{t('slug')}</strong>
                  <Form.Item
                    label={t('slug')}
                    name="slug"
                    rules={[{ required: true, message: t('validate') }]}
                  >
                    <Input size="large" placeholder="..." />
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
                  <strong style={{ color: '#c41d7f', fontSize: 15 }}>{t('order')}</strong>
                  <Form.Item
                    label={t('order')}
                    name="order"
                    rules={[{ required: true, message: t('validate') }]}
                  >
                    <Space.Compact style={{ width: '100%' }}>
                      <InputNumber controls size="large" min={1} style={{ width: '100%' }} />
                    </Space.Compact>
                  </Form.Item>
                </div>

                {/* === BUTTONS === */}
                <Form.Item>
                  <Space size="middle">
                    <Button type="primary" htmlType="submit" icon={<SaveOutlined />} size="large">
                      {t('createCategory')}
                    </Button>
                    <Button size="large" onClick={() => router.push('/admin/categories')}>
                      {t('cancel')}
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
