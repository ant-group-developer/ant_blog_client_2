'use client';

import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { ProLayout } from '@ant-design/pro-components';
import type { ProSettings } from '@ant-design/pro-components';
import {
  HomeOutlined,
  UserOutlined,
  UnorderedListOutlined,
  LogoutOutlined,
  LoginOutlined,
  GithubOutlined,
} from '@ant-design/icons';
import { Button, Space, Dropdown, ConfigProvider } from 'antd';
import type { MenuProps } from 'antd';
import { useAuthStore } from '@/store/authStore';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { useAntdLocale } from '@/hooks/useAntLocale';

const defaultProps = {
  route: {
    path: '/',
    routes: [
      { path: '/admin', name: 'Dashboard', icon: <HomeOutlined /> },
      { path: '/admin/users', name: 'Người dùng', icon: <UserOutlined /> },
      { path: '/admin/posts', name: 'Bài viết', icon: <UnorderedListOutlined /> },
      { path: '/admin/categories', name: 'Danh mục', icon: <UnorderedListOutlined /> },
    ],
  },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { currentUser, logout } = useAuthStore();
  const antdLocale = useAntdLocale();

  const handleLogout = () => {
    logout();
    router.push('/auth/login');
  };

  const avatarMenu: MenuProps['items'] = [
    {
      key: 'email',
      label: <span>{currentUser?.email || 'User'}</span>,
      disabled: true,
    },
    { type: 'divider' },
    {
      key: 'logout',
      label: (
        <Space>
          <LogoutOutlined />
          Đăng xuất
        </Space>
      ),
      onClick: handleLogout,
    },
  ];

  return (
    <ConfigProvider locale={antdLocale}>
      <div style={{ height: '100vh', overflow: 'hidden' }}>
        <ProLayout
          {...defaultProps}
          title="Admin Panel"
          logo="https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg"
          location={{ pathname }}
          fixSiderbar={true}
          layout="mix"
          splitMenus={false}
          siderWidth={208}
          contentStyle={{ padding: 0, margin: 0 }}
          token={{
            header: { colorBgMenuItemSelected: 'rgba(0,0,0,0.04)' },
            sider: { colorMenuBackground: '#fff' },
          }}
          avatarProps={
            currentUser
              ? {
                  src: 'https://gw.alipayobjects.com/zos/antfincdn/efFD%24IOql2/weixintupian_20170331104822.jpg',
                  size: 'small',
                  title: currentUser.email || 'User',
                  render: (_, dom) => (
                    <Dropdown menu={{ items: avatarMenu }} placement="bottomRight">
                      {dom}
                    </Dropdown>
                  ),
                }
              : {
                  render: () => (
                    <Button
                      type="primary"
                      icon={<LoginOutlined />}
                      onClick={() => router.push('/auth/login')}
                    >
                      Đăng nhập
                    </Button>
                  ),
                }
          }
          actionsRender={(props) => {
            if (props.isMobile) return [];
            return [
              <GithubOutlined key="github" style={{ fontSize: 16 }} />,
              <LanguageSwitcher key="lang" />,
            ];
          }}
          menuItemRender={(item, dom) => (
            <a
              onClick={(e) => {
                e.preventDefault();
                router.push(item.path || '/admin');
              }}
              style={{ display: 'block' }}
            >
              {dom}
            </a>
          )}
        >
          <div
            style={{
              padding: 24,
              background: '#f5f5f5',
              minHeight: 'calc(100vh - 64px)',
              overflow: 'auto',
            }}
          >
            {children}
          </div>
        </ProLayout>
      </div>
    </ConfigProvider>
  );
}
