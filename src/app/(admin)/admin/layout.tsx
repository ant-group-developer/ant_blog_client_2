'use client';

import React, { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { ProLayout } from '@ant-design/pro-components';
import type { ProSettings } from '@ant-design/pro-components';
import {
  HomeOutlined,
  UserOutlined,
  UnorderedListOutlined,
  LogoutOutlined,
  SettingOutlined,
  QuestionCircleOutlined,
  GithubOutlined,
  LoginOutlined,
} from '@ant-design/icons';
import { Button, Space, Dropdown, Spin } from 'antd';
import type { MenuProps } from 'antd';
import type { User } from '@/types';

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
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const [settings] = useState<Partial<ProSettings>>({
    fixSiderbar: true,
    layout: 'mix',
    splitMenus: false,
  });

  // Load user from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('currentUser');
    if (stored) {
      try {
        const user = JSON.parse(stored) as User;
        setCurrentUser(user);
      } catch {
        localStorage.removeItem('currentUser');
      }
    }
    setLoading(false);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('currentUser');
    setCurrentUser(null);
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

  if (loading) {
    return (
      <div
        style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}
      >
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div style={{ height: '100vh', overflow: 'hidden' }}>
      <ProLayout
        {...defaultProps}
        title="Admin Panel"
        logo="https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg"
        location={{ pathname }}
        layout={settings.layout}
        splitMenus={settings.splitMenus}
        fixSiderbar={settings.fixSiderbar}
        siderWidth={208}
        // Loại bỏ padding mặc định của content
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
            <QuestionCircleOutlined key="doc" style={{ fontSize: 16 }} />,
            <GithubOutlined key="github" style={{ fontSize: 16 }} />,
            <SettingOutlined key="settings" style={{ fontSize: 16 }} />,
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
        {/* Nội dung chính - không dùng PageContainer để tránh double header & padding thừa */}
        <div
          style={{
            padding: 24,
            background: '#f5f5f5',
            minHeight: 'calc(100vh - 64px)', // 64px = chiều cao header
            overflow: 'auto',
          }}
        >
          {children}
        </div>
      </ProLayout>
    </div>
  );
}
