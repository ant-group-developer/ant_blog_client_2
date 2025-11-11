'use client';

import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { userService } from '@/service/userService';
import { jwtDecode } from 'jwt-decode';

const { Title, Text } = Typography;

export default function LoginForm() {
  const router = useRouter();
  const [messageApi, contextHolder] = message.useMessage();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: { email: string; password: string }) => {
    try {
      setLoading(true);
      const res = await userService.login(values.email, values.password);

      if (!res || !res.accessToken) {
        messageApi.error(res?.message || 'Email hoặc mật khẩu không đúng');
        return;
      }

      // Lưu token
      localStorage.setItem('accessToken', res.accessToken);
      localStorage.setItem('refreshToken', res.refreshToken);

      // Giải mã JWT để lưu thông tin user
      try {
        const decoded: any = jwtDecode(res.accessToken);
        localStorage.setItem('currentUser', JSON.stringify(decoded));
      } catch {
        // Bỏ qua nếu không decode được
      }

      messageApi.success('Đăng nhập thành công!');
      setTimeout(() => router.push('/admin'), 800);
    } catch (error: any) {
      console.error(error);
      messageApi.error(error.response?.data?.message || 'Đăng nhập thất bại');
    } finally {
      setLoading(false);
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
        padding: 16,
      }}
    >
      {contextHolder}
      <Card
        style={{ maxWidth: 400, width: '100%', borderRadius: 8 }}
        styles={{ body: { padding: 32 } }} // SỬA TẠI ĐÂY: bodyStyle → styles.body
      >
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <Title level={3} style={{ margin: 0 }}>
            Đăng nhập
          </Title>
          <Text type="secondary">Nhập email và mật khẩu</Text>
        </div>

        <Form
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off"
          initialValues={{
            email: 'toantran@gmail.com',
            password: '1',
          }}
        >
          <Form.Item
            name="email"
            rules={[
              { required: true, message: 'Vui lòng nhập email!' },
              { type: 'email', message: 'Email không hợp lệ!' },
            ]}
          >
            <Input prefix={<UserOutlined />} size="large" placeholder="Email" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
          >
            <Input.Password prefix={<LockOutlined />} size="large" placeholder="Mật khẩu" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block size="large" loading={loading}>
              Đăng nhập
            </Button>
          </Form.Item>

          <div style={{ textAlign: 'center' }}>
            <Text>Chưa có tài khoản? </Text>
            <a
              onClick={(e) => {
                e.preventDefault();
                router.push('/auth/register');
              }}
              style={{ color: '#1677ff', cursor: 'pointer' }}
            >
              Đăng Ký
            </a>
          </div>
        </Form>
      </Card>
    </div>
  );
}
