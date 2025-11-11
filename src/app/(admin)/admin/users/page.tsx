'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  ProCard,
  ProTable,
  TableDropdown,
  type ActionType,
  type ProColumns,
} from '@ant-design/pro-components';
import { Tag, Avatar, message, Space } from 'antd';
import { EditOutlined, UserOutlined } from '@ant-design/icons';
import { userService } from '@/service/userService';
import type { User } from '@/types';
import UserEdit from '@/components/user/UserEdit';

export default function UserListPage() {
  const router = useRouter();
  const actionRef = useRef<ActionType>(null!);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    const stored = localStorage.getItem('currentUser');
    if (stored) {
      try {
        setCurrentUser(JSON.parse(stored));
      } catch (e) {
        console.error('Parse currentUser error:', e);
      }
    }
  }, []);

  const handleUpdateUser = async (updatedUser: User) => {
    try {
      const res = await userService.updateUser(updatedUser.id, updatedUser);
      const updated = res.data;

      actionRef.current?.reload();

      if (currentUser?.id === updated.id) {
        localStorage.setItem('currentUser', JSON.stringify(updated));
        setCurrentUser(updated);
      }

      messageApi.success('Cập nhật thành công!');
      setEditingUser(null);
    } catch (error: any) {
      messageApi.error(error.response?.data?.message || 'Cập nhật thất bại');
    }
  };

  const formatDate = (value: any): string => {
    if (!value) return '-';
    const date = new Date(String(value));
    return isNaN(date.getTime()) ? '-' : date.toLocaleString('vi-VN');
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
      title: 'Email',
      dataIndex: 'keyword',
      fieldProps: {
        placeholder: 'Nhập email để tìm kiếm',
      },
      render: (_, record) => (
        <Space>
          <Avatar size="small" icon={<UserOutlined />} />
          <strong>{record.email}</strong>
          {currentUser?.id === record.id && (
            <Tag color="blue" style={{ marginLeft: 8 }}>
              Bạn
            </Tag>
          )}
        </Space>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      width: 140,
      search: false,
      render: (status) => (
        <Tag color={status ? 'green' : 'red'}>{status ? 'Online' : 'Offline'}</Tag>
      ),
    },
    {
      title: 'Tạo lúc',
      dataIndex: 'created_at',
      width: 160,
      search: false,
      render: formatDate,
    },
    {
      title: 'Cập nhật lúc',
      dataIndex: 'updated_at',
      width: 160,
      search: false,
      render: formatDate,
    },
    {
      title: 'Hành động',
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
                name: 'Sửa',
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

  const request = async (params: any) => {
    const { current = 1, pageSize = 10, keyword = '' } = params;

    try {
      const res = await userService.getUsers({
        page: current,
        pageSize,
        keyword,
      });

      return {
        data: res.data || [],
        success: true,
        total: res.pagination?.totalItem || 0,
      };
    } catch (error: any) {
      console.error('Load users error:', error);
      messageApi.error(error.response?.data?.message || 'Lấy dữ liệu thất bại');
      return { data: [], success: false, total: 0 };
    }
  };

  return (
    <>
      {contextHolder}

      <ProCard
        title={
          <Space>
            <UserOutlined />
            Quản lý người dùng
          </Space>
        }
        extra={
          currentUser && (
            <span style={{ color: '#888' }}>
              Đang đăng nhập: <strong>{currentUser.email}</strong>
            </span>
          )
        }
        headerBordered
        style={{ margin: 24 }}
      >
        <ProTable<User>
          columns={columns}
          rowKey="id"
          actionRef={actionRef}
          request={request}
          pagination={{
            showQuickJumper: true,
            showSizeChanger: true,
            pageSizeOptions: ['10', '20', '50'],
            defaultPageSize: 10,
          }}
          search={{
            labelWidth: 'auto',
            filterType: 'query',
            defaultCollapsed: false,
            searchText: 'Tìm kiếm',
            resetText: 'Làm mới',
          }}
          toolBarRender={false}
          options={{
            reload: true,
            density: false,
            setting: false,
          }}
          scroll={{ x: 1000 }}
        />
      </ProCard>

      <UserEdit
        open={!!editingUser}
        onClose={() => setEditingUser(null)}
        user={editingUser}
        currentUserId={currentUser?.id}
        onUpdate={handleUpdateUser}
      />
    </>
  );
}
