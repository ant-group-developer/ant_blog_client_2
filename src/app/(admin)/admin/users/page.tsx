'use client';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import {
  ProTable,
  TableDropdown,
  type ProColumns,
  PageContainer,
} from '@ant-design/pro-components';
import { Tag, Avatar, message, Space, Input, Button } from 'antd';
import { EditOutlined, UserOutlined } from '@ant-design/icons';
import { useUsers, useUpdateUser } from '@/hooks/useUsers';
import { useAuthStore } from '@/store/authStore';
import UserEdit from '@/components/user/UserEdit';
import { User } from '@/types';
import { useLocale, useTranslations } from 'next-intl';

export default function UserListPage() {
  const { currentUser } = useAuthStore();
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [messageApi, contextHolder] = message.useMessage();
  const locale = useLocale(); // 'vi' | 'en'
  const t = useTranslations('userList');

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
          messageApi.success(t('updateSuccess'));
          setEditingUser(null);
        },
        onError: (err: unknown) => {
          const errorMessage =
            err instanceof Error && 'response' in err
              ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
              : undefined;
          messageApi.error(errorMessage || t('updateFailed'));
        },
      }
    );
  };

  const columns: ProColumns<User>[] = [
    {
      title: t('id'),
      dataIndex: 'id',
      width: 100, // nhỏ gọn, vì ID ngắn
      fixed: 'left',
      search: false,
      render: (id) => (
        <span style={{ fontFamily: 'monospace', fontSize: 12 }}>{String(id).slice(0, 8)}...</span>
      ),
    },
    {
      title: t('email'),
      dataIndex: 'email',
      width: 300, // tăng một chút để email hiển thị đầy đủ
      ellipsis: true, // nếu dài quá thì hiển thị ...
      search: false,
      render: (_, record) => (
        <Space>
          <Avatar size="small" icon={<UserOutlined />} />
          <strong>{record.email}</strong>
          {currentUser?.id === record.id && (
            <Tag color="blue" style={{ marginLeft: 8 }}>
              {t('you')}
            </Tag>
          )}
        </Space>
      ),
    },
    {
      title: t('status'),
      dataIndex: 'status',
      width: 120, // vừa phải
      search: false,
      render: (status) => (
        <Tag color={status ? 'green' : 'red'}>{status ? t('online') : t('offline')}</Tag>
      ),
    },
    {
      title: t('createdAt'),
      dataIndex: 'created_at',
      width: 160, // vừa đủ hiển thị ngày giờ
      search: false,
      render: (_, record) =>
        record.created_at
          ? new Date(record.created_at).toLocaleString(locale === 'vi' ? 'vi-VN' : 'en-US')
          : '-',
    },
    {
      title: t('updatedAt'),
      dataIndex: 'updated_at',
      width: 160, // vừa đủ
      search: false,
      render: (_, record) =>
        record.updated_at
          ? new Date(record.updated_at).toLocaleString(locale === 'vi' ? 'vi-VN' : 'en-US')
          : '-',
    },
    {
      title: t('actions'),
      key: 'action',
      width: 100, // rộng đủ để click menu dropdown
      fixed: 'right',
      search: false,
      render: (_, record) => {
        const isMe = currentUser?.id === record.id;
        return (
          <TableDropdown
            menus={[
              {
                key: 'edit',
                name: t('edit'),
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
        title={t('pageTitle')}
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
            <Space.Compact style={{ width: 320 }}>
              <Input
                placeholder={t('searchPlaceholder')}
                allowClear
                onPressEnter={(e) =>
                  setParams((prev) => ({
                    ...prev,
                    keyword: (e.target as HTMLInputElement).value,
                    page: 1,
                  }))
                }
                size="middle"
              />
              <Button
                type="primary"
                onClick={() => {
                  const input = document.querySelector<HTMLInputElement>('.ant-input')!;
                  setParams((prev) => ({ ...prev, keyword: input.value, page: 1 }));
                }}
              >
                {t('search')}
              </Button>
            </Space.Compact>
          </div>
        }
      >
        <div
          style={{
            background: '#fff',
            padding: 24,
            borderRadius: 8,
            height: 'calc(100vh - 240px)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
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
            scroll={{
              x: 1200,
              y: 'calc(100vh - 400px)',
            }}
            sticky={{
              offsetHeader: 0,
            }}
            style={{
              height: '100%',
              overflow: 'hidden',
            }}
            tableStyle={{
              height: '100%',
            }}
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
