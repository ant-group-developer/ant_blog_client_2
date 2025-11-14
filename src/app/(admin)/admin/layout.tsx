'use client';

import React, { useCallback, useMemo } from 'react';
import { usePathname, useRouter } from 'next/navigation';
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
import { useTranslations } from 'next-intl';
import ClientOnlyProLayout from '@/components/ClientOnlyProLayout';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { currentUser, logout } = useAuthStore();
  const antdLocale = useAntdLocale();
  const t = useTranslations('layoutAdmin');

  const handleLogout = useCallback(() => {
    logout();
    router.push('/auth/login');
  }, [logout, router]);

  // === Avatar menu memoized ===
  const avatarMenu: MenuProps['items'] = useMemo(() => {
    if (!currentUser) return [];
    return [
      {
        key: 'email',
        label: <span>{currentUser.email || t('userDefault')}</span>,
        disabled: true,
      },
      { type: 'divider' },
      {
        key: 'logout',
        label: (
          <Space>
            <LogoutOutlined />
            {t('logout')}
          </Space>
        ),
        onClick: handleLogout,
      },
    ];
  }, [currentUser, t, handleLogout]);

  // === Sider menu memoized ===
  const siderRoutes = useMemo(
    () => [
      { path: '/posts', name: t('home'), icon: <HomeOutlined /> },
      { path: '/admin/users', name: t('users'), icon: <UserOutlined /> },
      { path: '/admin/posts', name: t('posts'), icon: <UnorderedListOutlined /> },
      { path: '/admin/categories', name: t('categories'), icon: <UnorderedListOutlined /> },
    ],
    [t]
  );

  const defaultProps = useMemo(
    () => ({
      route: {
        path: '/',
        routes: siderRoutes,
      },
    }),
    [siderRoutes]
  );

  return (
    <ConfigProvider locale={antdLocale}>
      <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
        <ClientOnlyProLayout
          {...defaultProps}
          title={t('adminPanel')}
          logo="https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg"
          location={{ pathname }}
          fixSiderbar
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
                  src: 'https://img.tripi.vn/cdn-cgi/image/width=700,height=700/https://gcs.tripi.vn/public-tripi/tripi-feed/img/482740TND/anh-mo-ta.png',
                  size: 'small',
                  title: currentUser.email || t('userDefault'),
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
                      {t('login')}
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
          <div style={{ flex: 1, background: '#f5f5f5', overflow: 'hidden' }}>{children}</div>
        </ClientOnlyProLayout>
      </div>
    </ConfigProvider>
  );
}
