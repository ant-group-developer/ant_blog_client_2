'use client';

import React, { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { ProLayout, PageContainer, MenuDataItem } from '@ant-design/pro-components';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import { HomeOutlined, UserOutlined, UnorderedListOutlined } from '@ant-design/icons';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const menuItems: MenuDataItem[] = [
    { path: '/admin/users', name: 'Users', icon: <UserOutlined /> },
    { path: '/admin/posts', name: 'Posts', icon: <UnorderedListOutlined /> },
    { path: '/admin/categories', name: 'Categories', icon: <HomeOutlined /> },
  ];

  return (
    <NuqsAdapter>
      <ProLayout
        title="Admin Panel"
        layout="mix"
        collapsed={collapsed}
        onCollapse={setCollapsed}
        siderWidth={200}
        menuDataRender={() => menuItems}
        menuItemRender={(item, dom) => (
          <div
            onClick={() => {
              if (item.path) router.push(item.path);
            }}
          >
            {dom}
          </div>
        )}
        avatarProps={{ src: 'https://i.pravatar.cc/40', size: 'small' }}
        actionsRender={() => [<span key="1">Hi, Admin</span>]}
      >
        <PageContainer>{children}</PageContainer>
      </ProLayout>
    </NuqsAdapter>
  );
}
