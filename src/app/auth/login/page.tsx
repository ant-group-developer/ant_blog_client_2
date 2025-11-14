'use client';

import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { userService } from '@/service/userService';
import { jwtDecode } from 'jwt-decode';
import { useTranslations } from 'next-intl';

interface JwtPayload {
  id?: string;
  email?: string;
  [key: string]: unknown;
}

const { Title, Text } = Typography;

export default function LoginForm() {
  const [form] = Form.useForm();
  const router = useRouter();

  const [messageApi, contextHolder] = message.useMessage();
  const [loading, setLoading] = useState(false);
  const t = useTranslations('auth');

  const onFinish = async (values: { email: string; password: string }) => {
    try {
      setLoading(true);
      const res = await userService.login(values.email, values.password);

      if (!res || !res.accessToken) {
        messageApi.error(res?.message || t('login.errorMessage'));
        return;
      }

      // Lưu token
      localStorage.setItem('accessToken', res.accessToken);
      localStorage.setItem('refreshToken', res.refreshToken);

      // Giải mã JWT để lưu thông tin user
      try {
        const decoded: JwtPayload = jwtDecode(res.accessToken);
        localStorage.setItem('currentUser', JSON.stringify(decoded));
      } catch {
        // Bỏ qua nếu không decode được
      }

      messageApi.success(t('login.successMessage'));
      setTimeout(() => router.push('/posts'), 800);
    } catch (error: unknown) {
      console.error(error);
      const errorMessage =
        typeof error === 'object' && error !== null && 'response' in error
          ? (error as { response?: { data?: { message?: string } } }).response?.data?.message
          : undefined;
      messageApi.error(errorMessage || t('login.loginFaild'));
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
            {t('login.title')}
          </Title>
          <Text type="secondary">{t('login.subtitle')}</Text>
        </div>

        <Form
          form={form}
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
              { required: true, message: t('login.emailRequired') },
              { type: 'email', message: t('login.emailInvalid') },
            ]}
          >
            <Input
              prefix={<UserOutlined />}
              size="large"
              placeholder={t('login.emailPlaceholder')}
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: t('login.passwordRequired') }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              size="large"
              placeholder={t('login.passwordPlaceholder')}
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block size="large" loading={loading}>
              {t('login.title')}
            </Button>
          </Form.Item>

          <div style={{ textAlign: 'center' }}>
            <Text>{t('login.noAccount')} </Text>
            <a
              onClick={(e) => {
                e.preventDefault();
                router.push('/auth/register');
              }}
              style={{ color: '#1677ff', cursor: 'pointer' }}
            >
              {t('login.registerLink')}
            </a>
          </div>
        </Form>
      </Card>
    </div>
  );
}
