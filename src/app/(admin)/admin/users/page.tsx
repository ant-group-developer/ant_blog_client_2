'use client';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import {
  ProTable,
  TableDropdown,
  type ProColumns,
  PageContainer,
} from '@ant-design/pro-components';
import { Tag, Avatar, message, Space, Input } from 'antd';
import { EditOutlined, UserOutlined } from '@ant-design/icons';
import { useUsers, useUpdateUser } from '@/hooks/useUsers';
import { useAuthStore } from '@/store/authStore';
import UserEdit from '@/components/user/UserEdit';
import { User } from '@/types';
import { useLocale } from 'next-intl';

const { Search } = Input;

export default function UserListPage() {
  const router = useRouter();
  const { currentUser } = useAuthStore();
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [messageApi, contextHolder] = message.useMessage();
  const locale = useLocale(); // 'vi' | 'en'

  const [params, setParams] = useState({
    page: 1,
    pageSize: 10,
    keyword: '',
  });

  const { data, isLoading } = useUsers(params);
  const updateMutation = useUpdateUser();

  const handleUpdate = (user: User) => {
    updateMutation.mutate(
      { id: user.id, payload: user },
      {
        onSuccess: () => {
          messageApi.success(locale === 'vi' ? 'Cập nhật thành công!' : 'Updated successfully!');
          setEditingUser(null);
        },
        onError: (err: any) => {
          messageApi.error(
            err.response?.data?.message || (locale === 'vi' ? 'Cập nhật thất bại' : 'Update failed')
          );
        },
      }
    );
  };

  const columns: ProColumns<User>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      width: 100,
      search: false,
      render: (id) => (
        <span style={{ fontFamily: 'monospace', fontSize: 12 }}>{String(id).slice(0, 8)}...</span>
      ),
    },
    {
      title: locale === 'vi' ? 'Email' : 'Email',
      dataIndex: 'email',
      search: false,
      render: (_, record) => (
        <Space>
          <Avatar size="small" icon={<UserOutlined />} />
          <strong>{record.email}</strong>
          {currentUser?.id === record.id && (
            <Tag color="blue" style={{ marginLeft: 8 }}>
              {locale === 'vi' ? 'Bạn' : 'You'}
            </Tag>
          )}
        </Space>
      ),
    },
    {
      title: locale === 'vi' ? 'Trạng thái' : 'Status',
      dataIndex: 'status',
      width: 140,
      search: false,
      render: (status) => (
        <Tag color={status ? 'green' : 'red'}>
          {status
            ? locale === 'vi'
              ? 'Online'
              : 'Online'
            : locale === 'vi'
            ? 'Offline'
            : 'Offline'}
        </Tag>
      ),
    },
    {
      title: locale === 'vi' ? 'Tạo lúc' : 'Created At',
      dataIndex: 'created_at',
      width: 160,
      search: false,
      render: (_, record) =>
        record.created_at
          ? new Date(record.created_at).toLocaleString(locale === 'vi' ? 'vi-VN' : 'en-US')
          : '-',
    },
    {
      title: locale === 'vi' ? 'Cập nhật lúc' : 'Updated At',
      dataIndex: 'updated_at',
      width: 160,
      search: false,
      render: (_, record) =>
        record.updated_at
          ? new Date(record.updated_at).toLocaleString(locale === 'vi' ? 'vi-VN' : 'en-US')
          : '-',
    },
    {
      title: locale === 'vi' ? 'Hành động' : 'Actions',
      key: 'action',
      width: 80,
      fixed: 'right',
      search: false,
      render: (_, record) => {
        const isMe = currentUser?.id === record.id;
        return (
          <TableDropdown
            menus={[
              {
                key: 'edit',
                name: locale === 'vi' ? 'Sửa' : 'Edit',
                icon: <EditOutlined />,
                onClick: () => setEditingUser(record),
                disabled: !isMe,
              },
            ]}
          />
        );
      },
    },
  ];

  return (
    <>
      {contextHolder}
      <PageContainer
        title={locale === 'vi' ? 'Quản lý người dùng' : 'User Management'}
        breadcrumb={undefined}
        content={
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: 16,
            }}
          >
            <Search
              placeholder={locale === 'vi' ? 'Tìm kiếm người dùng...' : 'Search users...'}
              onSearch={(value) => {
                setParams((prev) => ({ ...prev, keyword: value, page: 1 }));
              }}
              allowClear
              enterButton
              style={{ width: 320 }}
            />
          </div>
        }
      >
        <div style={{ background: '#fff', padding: 24, borderRadius: 8 }}>
          <ProTable<User>
            columns={columns}
            rowKey="id"
            dataSource={data?.data}
            loading={isLoading}
            pagination={{
              total: data?.total,
              current: params.page,
              pageSize: params.pageSize,
              showQuickJumper: true,
              showSizeChanger: true,
              pageSizeOptions: ['10', '20', '50'],
              onChange: (page, pageSize) => setParams((p) => ({ ...p, page, pageSize })),
            }}
            toolBarRender={false}
            search={false}
            scroll={{ x: 1200 }}
          />
        </div>
      </PageContainer>

      <UserEdit
        open={!!editingUser}
        onClose={() => setEditingUser(null)}
        user={editingUser}
        currentUserId={currentUser?.id}
        onUpdate={handleUpdate}
      />
    </>
  );
}
