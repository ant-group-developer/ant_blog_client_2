// components/user/UserEdit.tsx
'use client';

import React, { useEffect } from 'react';
import { Modal, Form, Input, Switch, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import type { User } from '@/types';
import { useTranslations } from 'next-intl';

interface UserEditProps {
  open: boolean;
  onClose: () => void;
  user: User | null;
  currentUserId?: string;
  onUpdate?: (user: User) => void;
}

export default function UserEdit({ open, onClose, user, currentUserId, onUpdate }: UserEditProps) {
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const t = useTranslations('edit');

  const isSelf = user?.id === currentUserId;

  useEffect(() => {
    if (open && user) {
      form.setFieldsValue({
        email: user.email,
        status: user.status,
        password: '',
      });
    } else {
      form.resetFields();
    }
  }, [open, user, form]);

  const handleSave = async () => {
    if (!user || !isSelf) return;

    try {
      const values = await form.validateFields();

      const payload: Partial<User> = {
        email: values.email,
        status: values.status ?? user.status,
      };

      if (values.password?.trim()) {
        payload.password = values.password.trim();
      }

      // Kiểm tra có thay đổi không
      if (payload.email === user.email && payload.status === user.status && !payload.password) {
        messageApi.info(t('noChange'));
        onClose();
        return;
      }

      // ✅ FIX: Tạo updated user từ data hiện tại + payload
      const optimisticUser: User = {
        ...user,
        ...payload,
        updated_at: new Date().toISOString(),
      };

      // Gọi callback trước để UI update ngay
      onUpdate?.(optimisticUser);

      messageApi.success(t('updateSuccess'));
      onClose();
    } catch (error: any) {
      console.error('Update user error:', error);
      messageApi.error(error.response?.data?.message || t('updateFailed'));
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onClose();
  };

  return (
    <>
      {contextHolder}
      <Modal
        title={isSelf ? t('modalTitleUser') : 'Xem thông tin người dùng'}
        open={open}
        onCancel={handleCancel}
        onOk={handleSave}
        okText={t('okText')}
        cancelText={t('cancelText')}
        okButtonProps={{ disabled: !isSelf }}
        width={500}
        destroyOnHidden
        forceRender
      >
        <Form form={form} layout="vertical" autoComplete="off">
          {user ? (
            <>
              <Form.Item
                label={t('user.email')}
                name="email"
                rules={[
                  { required: true, message: t('user.enterEmail') },
                  { type: 'email', message: t('user.validatedEmail') },
                ]}
              >
                <Input prefix={<UserOutlined />} disabled={!isSelf} />
              </Form.Item>

              <Form.Item
                label={t('user.password')}
                name="password"
                rules={[{ min: 6, message: t('user.validated') }]}
                extra={t('user.passwordExtra')}
              >
                <Input.Password prefix={<LockOutlined />} disabled={!isSelf} />
              </Form.Item>

              <Form.Item label={t('user.status')} name="status" valuePropName="checked">
                <Switch
                  checkedChildren={t('user.online')}
                  unCheckedChildren={t('user.offline')}
                  disabled={!isSelf}
                />
              </Form.Item>
            </>
          ) : (
            <div style={{ textAlign: 'center', padding: '40px 0', color: '#999' }}>
              <UserOutlined style={{ fontSize: 48, marginBottom: 16 }} />
              <p>{t('user.noData')}</p>
            </div>
          )}
        </Form>
      </Modal>
    </>
  );
}
