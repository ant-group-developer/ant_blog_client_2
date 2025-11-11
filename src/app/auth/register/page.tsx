'use client';

import React from 'react';
import { Form, Input, Button, Card, Typography, Divider, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { userService } from '@/service/userService';

const { Title, Text, Link } = Typography;

export default function RegisterForm() {
  const [messageApi, contextHolder] = message.useMessage();

  const handleRegister = async (values: { email: string; password: string }) => {
    try {
      const res = await userService.createUser(values);

      if (res.message?.includes('exist')) {
        messageApi.error('Email đã tồn tại!');
        return;
      }

      messageApi.success('Đăng ký thành công!');

      setTimeout(() => {
        window.location.href = '/auth/login';
      }, 800);
    } catch (error: any) {
      console.error(error);
      messageApi.error(error?.message || 'Đăng ký thất bại!');
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#f0f2f5',
        padding: '16px',
      }}
    >
      {contextHolder}
      <Card
        style={{
          maxWidth: 400,
          width: '100%',
          borderRadius: 8,
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        }}
        bodyStyle={{ padding: 32 }}
      >
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <Title level={3} style={{ margin: 0 }}>
            Đăng ký
          </Title>
          <Text type="secondary">Nhập email và mật khẩu để tạo tài khoản</Text>
        </div>

        <Form name="register" layout="vertical" onFinish={handleRegister} autoComplete="off">
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Vui lòng nhập email!' },
              { type: 'email', message: 'Email không hợp lệ!' },
            ]}
          >
            <Input prefix={<UserOutlined />} placeholder="user@example.com" size="large" />
          </Form.Item>

          <Form.Item
            name="password"
            label="Mật khẩu"
            rules={[
              { required: true, message: 'Vui lòng nhập mật khẩu!' },
              { min: 6, message: 'Mật khẩu ít nhất 6 ký tự!' },
            ]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Mật khẩu" size="large" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block size="large">
              Đăng ký
            </Button>
          </Form.Item>

          <Divider plain>Hoặc</Divider>

          <div style={{ textAlign: 'center' }}>
            <Text>Đã có tài khoản? </Text>
            <Link onClick={() => (window.location.href = '/auth/login')}>Đăng nhập</Link>
          </div>
        </Form>
      </Card>
    </div>
  );
}
