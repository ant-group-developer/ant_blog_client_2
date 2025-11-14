'use client';

import React, { useEffect } from 'react';
import { Modal, Form, Input, message } from 'antd';
import { EditOutlined, LinkOutlined } from '@ant-design/icons';
import { useLocale, useTranslations } from 'next-intl';
import type { Post } from '@/types';
import { useUpdatePost } from '@/hooks/usePosts'; // Dùng hook mutation

const { TextArea } = Input;

interface PostEditProps {
  open: boolean;
  onClose: () => void;
  post: Post | null;
  onUpdate?: (post: Post) => void;
}

export default function PostEdit({ open, onClose, post, onUpdate }: PostEditProps) {
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const locale = useLocale();
  const t = useTranslations('edit');

  const updateMutation = useUpdatePost();

  useEffect(() => {
    if (open && post) {
      form.setFieldsValue({
        title_vi: post.title_vi,
        title_en: post.title_en ?? '',
        description_vi: post.description_vi,
        description_en: post.description_en ?? '',
        content_vi: post.content_vi,
        content_en: post.content_en ?? '',
        thumbnail: post.thumbnail ?? '',
      });
    }
  }, [open, post, form]);

  const handleSave = async () => {
    if (!post) return;

    try {
      const values = await form.validateFields();

      const payload: Partial<Post> = {};
      const keys = [
        'title_vi',
        'title_en',
        'description_vi',
        'description_en',
        'content_vi',
        'content_en',
        'thumbnail',
      ] as const;

      keys.forEach((k) => {
        const oldVal = post[k] ?? '';
        const newVal = values[k] ?? '';
        if (oldVal !== newVal) {
          payload[k] = newVal || undefined;
        }
      });

      payload.category_id = post.category_id;

      const hasChanges = Object.keys(payload).some(
        (k) => k !== 'category_id' && payload[k as keyof Post] !== undefined
      );

      if (!hasChanges) {
        messageApi.info(t('noChange'));
        onClose();
        return;
      }

      // Gửi API
      await updateMutation.mutateAsync({
        id: Number(post.id),
        payload,
      });

      messageApi.success(t('updateSuccess'));
      onUpdate?.({ ...post, ...payload });
      onClose();
    } catch (err: any) {
      const errorMsg = err?.response?.data?.message || t('updateFailed');
      messageApi.error(errorMsg);
    }
  };

  const isLoading = updateMutation.isPending;

  return (
    <>
      {contextHolder}
      <Modal
        title={t('modalTitlePost')}
        open={open}
        onCancel={onClose}
        onOk={handleSave}
        okText={t('okText')}
        cancelText={t('cancelText')}
        width={900}
        confirmLoading={isLoading}
        okButtonProps={{ disabled: isLoading }}
        destroyOnHidden
        forceRender
        afterOpenChange={(isOpen) => {
          if (!isOpen) form.resetFields();
        }}
      >
        <Form form={form} layout="vertical" autoComplete="off" disabled={isLoading}>
          <div style={{ background: '#f9f9f9', padding: 16, borderRadius: 8, marginBottom: 16 }}>
            <Form.Item
              label={t('post.title_vi')}
              name="title_vi"
              rules={[
                {
                  required: true,
                  message: t('post.validated'),
                },
              ]}
            >
              <Input prefix={<EditOutlined />} />
            </Form.Item>

            <Form.Item
              label={t('post.description_vi')}
              name="description_vi"
              rules={[
                {
                  required: true,
                  message: t('post.validated'),
                },
              ]}
            >
              <TextArea rows={2} />
            </Form.Item>

            <Form.Item
              label={t('post.content_vi')}
              name="content_vi"
              rules={[
                {
                  required: true,
                  message: t('post.validated'),
                },
              ]}
            >
              <TextArea rows={6} />
            </Form.Item>
          </div>

          {/* --- TIẾNG ANH --- */}
          <div style={{ background: '#e6f7ff', padding: 16, borderRadius: 8, marginBottom: 16 }}>
            <Form.Item
              label={t('post.title_en')}
              name="title_en"
              rules={[
                {
                  required: true,
                  message: t('post.validated'),
                },
              ]}
            >
              <Input prefix={<EditOutlined />} placeholder="Optional" />
            </Form.Item>

            <Form.Item
              label={t('post.description_en')}
              name="description_en"
              rules={[
                {
                  required: true,
                  message: t('post.validated'),
                },
              ]}
            >
              <TextArea rows={2} placeholder="Optional" />
            </Form.Item>

            <Form.Item
              label={t('post.content_en')}
              name="content_en"
              rules={[
                {
                  required: true,
                  message: t('post.validated'),
                },
              ]}
            >
              <TextArea rows={6} placeholder="Optional" />
            </Form.Item>
          </div>

          {/* --- THUMBNAIL --- */}
          <Form.Item
            label={t('post.thumbnail')}
            name="thumbnail"
            rules={[
              {
                required: true,
                message: t('post.validated'),
              },
            ]}
          >
            <Input prefix={<LinkOutlined />} placeholder="https://example.com/image.jpg" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
