'use client';

import React, { useEffect } from 'react';
import { Modal, Form, Input, message } from 'antd';
import { EditOutlined, LinkOutlined } from '@ant-design/icons';
import { useLocale } from 'next-intl';
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

  // Dùng hook mutation
  const updateMutation = useUpdatePost();

  // Cập nhật form khi mở modal
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

      // Tạo payload chỉ với các field thay đổi
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

      // Nếu không có thay đổi nào (ngoại trừ category_id)
      const hasChanges = Object.keys(payload).some(
        (k) => k !== 'category_id' && payload[k as keyof Post] !== undefined
      );

      if (!hasChanges) {
        messageApi.info(locale === 'vi' ? 'Không có thay đổi nào' : 'No changes detected');
        onClose();
        return;
      }

      // Gửi API
      await updateMutation.mutateAsync({
        id: Number(post.id), // "7" → 7
        payload,
      });

      messageApi.success(locale === 'vi' ? 'Cập nhật thành công!' : 'Updated successfully!');
      onUpdate?.({ ...post, ...payload });
      onClose();
    } catch (err: any) {
      const errorMsg =
        err?.response?.data?.message || (locale === 'vi' ? 'Cập nhật thất bại' : 'Update failed');
      messageApi.error(errorMsg);
    }
  };

  const isLoading = updateMutation.isPending;

  return (
    <>
      {contextHolder}
      <Modal
        title={locale === 'vi' ? 'Chỉnh sửa bài viết' : 'Edit Post'}
        open={open}
        onCancel={onClose}
        onOk={handleSave}
        okText={locale === 'vi' ? 'Lưu thay đổi' : 'Save Changes'}
        cancelText={locale === 'vi' ? 'Hủy' : 'Cancel'}
        width={900}
        confirmLoading={isLoading}
        okButtonProps={{ disabled: isLoading }}
        destroyOnHidden
        afterOpenChange={(isOpen) => {
          if (!isOpen) form.resetFields();
        }}
      >
        <Form form={form} layout="vertical" autoComplete="off" disabled={isLoading}>
          {/* --- TIẾNG VIỆT --- */}
          <div style={{ background: '#f9f9f9', padding: 16, borderRadius: 8, marginBottom: 16 }}>
            <strong style={{ color: '#d4380d' }}>
              {locale === 'vi' ? 'Tiếng Việt (bắt buộc)' : 'Vietnamese (required)'}
            </strong>

            <Form.Item
              label={locale === 'vi' ? 'Tiêu đề' : 'Title'}
              name="title_vi"
              rules={[
                {
                  required: true,
                  message: locale === 'vi' ? 'Vui lòng nhập tiêu đề!' : 'Please enter title!',
                },
              ]}
            >
              <Input prefix={<EditOutlined />} />
            </Form.Item>

            <Form.Item
              label={locale === 'vi' ? 'Mô tả ngắn' : 'Short Description'}
              name="description_vi"
              rules={[
                {
                  required: true,
                  message: locale === 'vi' ? 'Vui lòng nhập mô tả!' : 'Please enter description!',
                },
              ]}
            >
              <TextArea rows={2} />
            </Form.Item>

            <Form.Item
              label={locale === 'vi' ? 'Nội dung' : 'Content'}
              name="content_vi"
              rules={[
                {
                  required: true,
                  message: locale === 'vi' ? 'Vui lòng nhập nội dung!' : 'Please enter content!',
                },
              ]}
            >
              <TextArea rows={6} />
            </Form.Item>
          </div>

          {/* --- TIẾNG ANH --- */}
          <div style={{ background: '#e6f7ff', padding: 16, borderRadius: 8, marginBottom: 16 }}>
            <strong style={{ color: '#1890ff' }}>
              {locale === 'vi' ? 'Tiếng Anh (tùy chọn)' : 'English (optional)'}
            </strong>

            <Form.Item label={locale === 'vi' ? 'Tiêu đề' : 'Title'} name="title_en">
              <Input prefix={<EditOutlined />} placeholder="Optional" />
            </Form.Item>

            <Form.Item
              label={locale === 'vi' ? 'Mô tả ngắn' : 'Short Description'}
              name="description_en"
            >
              <TextArea rows={2} placeholder="Optional" />
            </Form.Item>

            <Form.Item label={locale === 'vi' ? 'Nội dung' : 'Content'} name="content_en">
              <TextArea rows={6} placeholder="Optional" />
            </Form.Item>
          </div>

          {/* --- THUMBNAIL --- */}
          <Form.Item
            label="Thumbnail URL"
            name="thumbnail"
            rules={[
              {
                required: true,
                message: locale === 'vi' ? 'Vui lòng nhập URL ảnh!' : 'Please enter image URL!',
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
