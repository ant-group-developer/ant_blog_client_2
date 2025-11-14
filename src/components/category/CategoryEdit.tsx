'use client';

import React, { useEffect } from 'react';
import { Modal, Form, Input, message } from 'antd';
import { useUpdateCategory } from '@/hooks/useCategories';
import { Category } from '@/types';
import { useTranslations } from 'next-intl';

interface CategoryEditProps {
  open: boolean;
  onClose: () => void;
  category: Category | null;
  onUpdate?: (updated: Category) => void;
}

export default function CategoryEdit({ open, onClose, category, onUpdate }: CategoryEditProps) {
  const [form] = Form.useForm();
  const updateMutation = useUpdateCategory();
  const [messageApi, contextHolder] = message.useMessage();
  const t = useTranslations('edit');

  useEffect(() => {
    if (open && category) {
      form.setFieldsValue({
        name_vi: category.name_vi,
        name_en: category.name_en,
        slug: category.slug,
      });
    } else {
      form.resetFields();
    }
  }, [open, category, form]);

  const handleUpdate = async () => {
    if (!category) return;

    try {
      const values = await form.validateFields();

      const payload: Partial<Category> = {};
      const keys = ['name_vi', 'name_en', 'slug'] as const;

      keys.forEach((k) => {
        const oldVal = category[k] ?? '';
        const newVal = values[k] ?? '';
        if (oldVal !== newVal) {
          payload[k] = newVal || undefined;
        }
      });

      payload.order = category.order;

      const hasChanges = Object.keys(payload).some(
        (k) => k !== 'order' && payload[k as keyof Category] !== undefined
      );

      if (!hasChanges) {
        messageApi.info(t('noChange'));
        onClose();
        return;
      }

      await updateMutation.mutateAsync({
        id: Number(category.id),
        payload,
      });

      messageApi.success(t('updateSuccess'));
      onUpdate?.({ ...category, ...payload });
      onClose();
    } catch (error: unknown) {
      console.error(error);
      const errorMessage =
        typeof error === 'object' && error !== null && 'response' in error
          ? (error as { response?: { data?: { message?: string } } }).response?.data?.message
          : undefined;
      messageApi.error(errorMessage || t('updateFailed'));
    }
  };

  return (
    <>
      {contextHolder}
      <Modal
        title={t('modalTitleCategory')}
        open={open}
        onCancel={onClose}
        onOk={handleUpdate}
        okText={t('okText')}
        cancelText={t('cancelText')}
        confirmLoading={updateMutation.isPending}
        okButtonProps={{ disabled: updateMutation.isPending }}
        destroyOnHidden
        forceRender
      >
        <Form form={form} layout="vertical" autoComplete="off" disabled={updateMutation.isPending}>
          <Form.Item
            label={t('category.name_vi')}
            name="name_vi"
            rules={[
              {
                required: true,
                message: t('category.validated'),
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item label={t('category.name_en')} name="name_en">
            <Input />
          </Form.Item>

          <Form.Item
            label={t('category.slug')}
            name="slug"
            rules={[
              {
                required: true,
                message: t('category.validated'),
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
