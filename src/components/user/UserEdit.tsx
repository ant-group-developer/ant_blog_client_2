// components/user/UserEdit.tsx
'use client';

import React, { useEffect } from 'react';
import { Modal, Form, Input, Switch, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import type { User } from '@/types';
import { userService } from '@/service/userService';

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
      const payload: Partial<User> = {};

      if (values.email !== user.email) payload.email = values.email;
      if (values.password?.trim()) payload.password = values.password.trim();
      if (values.status !== user.status) payload.status = values.status;

      if (Object.keys(payload).length === 0) {
        messageApi.info('Không có thay đổi nào');
        onClose();
        return;
      }

      const res = await userService.updateUser(user.id, payload);
      onUpdate?.(res.data);
      messageApi.success('Cập nhật thành công!');
      onClose();
    } catch (error: any) {
      messageApi.error(error.response?.data?.message || 'Cập nhật thất bại');
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onClose();
  };

  // PHẢI CÓ RETURN
  return (
    <>
      {contextHolder}
      <Modal
        title={isSelf ? 'Chỉnh sửa thông tin cá nhân' : 'Xem thông tin người dùng'}
        open={open}
        onCancel={handleCancel}
        onOk={handleSave}
        okText="Lưu thay đổi"
        cancelText="Hủy"
        okButtonProps={{ disabled: !isSelf }}
        width={500}
        destroyOnHidden
      >
        <Form form={form} layout="vertical" autoComplete="off">
          {user ? (
            <>
              <Form.Item
                label="Email"
                name="email"
                rules={[
                  { required: true, message: 'Vui lòng nhập email!' },
                  { type: 'email', message: 'Email không hợp lệ!' },
                ]}
              >
                <Input prefix={<UserOutlined />} disabled={!isSelf} />
              </Form.Item>

              <Form.Item
                label="Mật khẩu mới"
                name="password"
                rules={[{ min: 6, message: 'Mật khẩu ít nhất 6 ký tự!' }]}
                extra="Để trống nếu không muốn thay đổi"
              >
                <Input.Password prefix={<LockOutlined />} disabled={!isSelf} />
              </Form.Item>

              <Form.Item label="Trạng thái" name="status" valuePropName="checked">
                <Switch checkedChildren="Online" unCheckedChildren="Offline" disabled={!isSelf} />
              </Form.Item>
            </>
          ) : (
            <div style={{ textAlign: 'center', padding: '40px 0', color: '#999' }}>
              <UserOutlined style={{ fontSize: 48, marginBottom: 16 }} />
              <p>Không có thông tin người dùng</p>
            </div>
          )}
        </Form>
      </Modal>
    </>
  );
}
