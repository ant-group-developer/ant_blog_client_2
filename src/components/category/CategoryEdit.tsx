'use client';

import React, { useEffect } from 'react';
import { Modal, Form, Input, Button, message } from 'antd';
import { useUpdateCategory } from '@/hooks/useCategories';
import { Category } from '@/types';
import { useLocale } from 'next-intl';

interface CategoryEditProps {
  open: boolean;
  onClose: () => void;
  category: Category | null;
  onUpdate?: () => void; // thêm onUpdate
}

export default function CategoryEdit({ open, onClose, category, onUpdate }: CategoryEditProps) {
  const [form] = Form.useForm();
  const locale = useLocale();
  const updateMutation = useUpdateCategory();
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    if (category) {
      form.setFieldsValue({
        name_vi: category.name_vi,
        name_en: category.name_en,
        slug: category.slug,
      });
    } else {
      form.resetFields();
    }
  }, [category, form]);

  const handleUpdate = (values: any) => {
    if (!category) return;
    updateMutation.mutate(
      { id: category.id, payload: values },
      {
        onSuccess: () => {
          messageApi.success(locale === 'vi' ? 'Cập nhật thành công!' : 'Update success!');
          onClose();
          if (onUpdate) onUpdate();
        },
        onError: (err: any) => {
          messageApi.error(
            err.response?.data?.message || (locale === 'vi' ? 'Cập nhật thất bại' : 'Update failed')
          );
        },
      }
    );
  };

  return (
    <>
      {contextHolder}
      <Modal
        title={locale === 'vi' ? 'Chỉnh sửa danh mục' : 'Edit Category'}
        open={open}
        onCancel={onClose}
        footer={[
          <Button key="cancel" onClick={onClose}>
            {locale === 'vi' ? 'Hủy' : 'Cancel'}
          </Button>,
          <Button
            key="submit"
            type="primary"
            onClick={() => form.submit()}
            loading={updateMutation.status === 'pending'}
          >
            {locale === 'vi' ? 'Cập nhật' : 'Update'}
          </Button>,
        ]}
      >
        <Form form={form} layout="vertical" onFinish={handleUpdate}>
          <Form.Item
            label={locale === 'vi' ? 'Tên (Tiếng Việt)' : 'Name (Vietnamese)'}
            name="name_vi"
            rules={[
              {
                required: true,
                message:
                  locale === 'vi' ? 'Vui lòng nhập tên tiếng Việt' : 'Please enter Vietnamese name',
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item label={locale === 'vi' ? 'Tên (Tiếng Anh)' : 'Name (English)'} name="name_en">
            <Input />
          </Form.Item>

          <Form.Item
            label="Slug"
            name="slug"
            rules={[
              {
                required: true,
                message: locale === 'vi' ? 'Vui lòng nhập slug' : 'Please enter slug',
              },
            ]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
