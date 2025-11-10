"use client";

import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  ProLayout,
  PageContainer,
  MenuDataItem,
} from "@ant-design/pro-components";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import {
  HomeOutlined,
  UserOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  // ✅ Giữ collapsed cố định ban đầu để không lệch SSR
  const [collapsed, setCollapsed] = useState(false);

  // ✅ Chỉ lấy pathname sau khi client mount (tránh SSR mismatch)
  const [currentPath, setCurrentPath] = useState<string | null>(null);
  useEffect(() => {
    setCurrentPath(pathname);
  }, [pathname]);

  // ✅ Menu cố định (không phụ thuộc giá trị thay đổi)
  const menuItems: MenuDataItem[] = [
    { path: "/admin/users", name: "Users", icon: <UserOutlined /> },
    { path: "/admin/posts", name: "Posts", icon: <UnorderedListOutlined /> },
    { path: "/admin/categories", name: "Categories", icon: <HomeOutlined /> },
  ];

  // ⚡ Tránh render khi chưa có pathname (chờ đến khi client mount)
  if (!currentPath) return null;

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
        // ✅ Avatar dùng ảnh cố định để không random giữa server/client
        avatarProps={{ src: "/static/avatar.png", size: "small" }}
        actionsRender={() => [<span key="1">Hi, Admin</span>]}
      >
        <PageContainer>{children}</PageContainer>
      </ProLayout>
    </NuqsAdapter>
  );
}
