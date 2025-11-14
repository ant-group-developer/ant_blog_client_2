'use client';

import React from 'react';
import { PageContainer } from '@ant-design/pro-components';
import {
  ReadOutlined,
  HomeOutlined,
  InfoCircleOutlined,
  MailOutlined,
  UserOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import { theme, Dropdown, Avatar, Typography, Button, message } from 'antd';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { useTranslations } from 'next-intl';
import ClientOnlyProLayout from '@/components/ClientOnlyProLayout';

const { Text } = Typography;

// Component User Avatar Dropdown
function UserAvatarDropdown() {
  const router = useRouter();
  const { currentUser, logout } = useAuthStore();
  const [messageApi] = message.useMessage();

  const t = useTranslations('layoutPost');

  const handleLogout = () => {
    logout();
    messageApi.success(t('logoutSuccess'));
    router.push('/auth/login');
  };

  // Nếu chưa đăng nhập
  if (!currentUser) {
    return (
      <Link href="/auth/login">
        <Button type="primary" size="small">
          {t('login')}
        </Button>
      </Link>
    );
  }

  const menuItems = [
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: t('logout'),
      danger: true,
      onClick: handleLogout,
    },
  ];

  return (
    <Dropdown menu={{ items: menuItems }} placement="bottomRight" arrow trigger={['hover']}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          cursor: 'pointer',
          padding: '6px 12px',
          borderRadius: 8,
          transition: 'all 0.2s',
          border: '1px solid transparent',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'rgba(0,0,0,0.04)';
          e.currentTarget.style.borderColor = '#e8e8e8';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'transparent';
          e.currentTarget.style.borderColor = 'transparent';
        }}
      >
        <Avatar
          size={28}
          icon={<UserOutlined />}
          src={
            'https://img.tripi.vn/cdn-cgi/image/width=700,height=700/https://gcs.tripi.vn/public-tripi/tripi-feed/img/482740TND/anh-mo-ta.png'
          }
          style={{ background: '#1890ff', flexShrink: 0 }}
        />
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            minWidth: 0,
          }}
        >
          <Text
            strong
            style={{
              fontSize: 14,
              lineHeight: 1.2,
              maxWidth: 150,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {currentUser.email || 'User'}
          </Text>
        </div>
      </div>
    </Dropdown>
  );
}

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  const { token } = theme.useToken();
  const pathname = usePathname();
  const t = useTranslations('layoutPost');

  return (
    <ClientOnlyProLayout
      title={t('title')}
      layout="top"
      logo="https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg"
      navTheme="light"
      fixedHeader
      route={{
        routes: [
          { path: '/posts', name: t('home'), icon: <HomeOutlined /> },
          { path: '/admin/users', name: t('admin'), icon: <ReadOutlined /> },
          { name: t('about'), icon: <InfoCircleOutlined /> },
          { name: t('contact'), icon: <MailOutlined /> },
        ],
      }}
      menuItemRender={(item, dom) => <Link href={item.path || '/'}>{dom}</Link>}
      location={{ pathname }}
      token={{
        header: {
          colorBgHeader: '#fff',
          colorTextMenu: 'rgba(0,0,0,0.88)',
          colorTextMenuActive: token.colorPrimary,
          colorBgMenuItemHover: 'rgba(0,0,0,0.03)',
        },
      }}
      // Actions render ở bên phải header
      actionsRender={() => [<LanguageSwitcher key="language" />, <UserAvatarDropdown key="user" />]}
      footerRender={() => (
        <div
          style={{
            textAlign: 'center',
            padding: 16,
            borderTop: '1px solid #f0f0f0',
            background: '#fafafa',
          }}
        >
          {new Date().getFullYear()}
        </div>
      )}
    >
      <PageContainer
        header={{
          title: t('postsTitle'),
          breadcrumb: undefined,
        }}
      >
        <div
          style={{
            padding: 24,
            background: '#fff',
            borderRadius: token.borderRadiusLG,
            minHeight: 'calc(100vh - 180px)',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          }}
        >
          {children}
        </div>
      </PageContainer>
    </ClientOnlyProLayout>
  );
}
