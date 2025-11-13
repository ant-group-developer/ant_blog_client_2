'use client';

import React from 'react';
import { Form, Input, Button, Card, Typography, Divider, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { userService } from '@/service/userService';
import { useTranslations } from 'next-intl';

const { Title, Text, Link } = Typography;

export default function RegisterForm() {
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const t = useTranslations('auth');

  const handleRegister = async (values: { email: string; password: string }) => {
    try {
      const res = await userService.createUser(values);

      if (res.message?.includes('exist')) {
        messageApi.error(t('register.emailExist'));
        return;
      }

      messageApi.success(t('register.successMessage'));

      setTimeout(() => {
        window.location.href = '/auth/login';
      }, 800);
    } catch (error: any) {
      console.error(error);
      messageApi.error(error?.message || t('register.errorMessage'));
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
        styles={{ body: { padding: 32 } }}
      >
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <Title level={3} style={{ margin: 0 }}>
            {t('register.title')}
          </Title>
          <Text type="secondary">{t('register.subtitle')}</Text>
        </div>

        <Form
          form={form}
          name="register"
          layout="vertical"
          onFinish={handleRegister}
          autoComplete="off"
        >
          <Form.Item
            name="email"
            label={t('register.emailLabel')}
            rules={[
              { required: true, message: t('login.emailRequired') },
              { type: 'email', message: t('login.emailInvalid') },
            ]}
          >
            <Input prefix={<UserOutlined />} placeholder="user@example.com" size="large" />
          </Form.Item>

          <Form.Item
            name="password"
            label={t('register.passwordLabel')}
            rules={[
              { required: true, message: t('login.passwordRequired') },
              { min: 6, message: t('login.passwordInvalid') },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder={t('register.passwordLabel')}
              size="large"
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block size="large">
              {t('register.registerButton')}
            </Button>
          </Form.Item>

          <div style={{ textAlign: 'center' }}>
            <Text>{t('register.haveAccount')} </Text>
            <Link onClick={() => (window.location.href = '/auth/login')}>
              {t('register.loginLink')}
            </Link>
          </div>
        </Form>
      </Card>
    </div>
  );
}
