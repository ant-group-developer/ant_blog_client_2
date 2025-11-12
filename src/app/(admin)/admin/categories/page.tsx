'use client';

import React, { useState } from 'react';
import { PageContainer } from '@ant-design/pro-components';
import { Table, Button, Space, message, Popconfirm, Input, Tag } from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
} from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useLocale } from 'next-intl';

import { categoryService } from '@/service/categoryService';
import { Category } from '@/types';
import CategoryEdit from '@/components/category/CategoryEdit';
import { useAuthStore } from '@/store/authStore';

const { Search } = Input;

export default function CategoriesPage() {
  const router = useRouter();
  const locale = useLocale(); // 'vi' | 'en'
  const queryClient = useQueryClient();
  const { currentUser } = useAuthStore();

  const [searchKeyword, setSearchKeyword] = useState('');
  const [pagination, setPagination] = useState({ page: 1, pageSize: 10 });
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  // === FETCH CATEGORIES ===
  const { data, isLoading } = useQuery({
    queryKey: ['categories', pagination.page, pagination.pageSize, searchKeyword],
    queryFn: () =>
      categoryService.getCategories({
        page: pagination.page,
        pageSize: pagination.pageSize,
        keyword: searchKeyword,
      }),
  });

  const categories: Category[] = data?.data || [];
  const paginationData = data?.pagination;

  // === DELETE MUTATION ===
  const deleteMutation = useMutation({
    mutationFn: (id: string) => categoryService.deleteCategory(id),
    onSuccess: () => {
      message.success(
        locale === 'vi' ? 'Xóa danh mục thành công!' : 'Category deleted successfully!'
      );
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
    onError: () => message.error(locale === 'vi' ? 'Xóa thất bại' : 'Delete failed'),
  });

  // === UPDATE ORDER MUTATION ===
  const updateOrderMutation = useMutation({
    mutationFn: (categories: { id: string; order: number }[]) =>
      categoryService.updateOrder(categories),
    onSuccess: () => {
      message.success(
        locale === 'vi' ? 'Cập nhật thứ tự thành công!' : 'Order updated successfully!'
      );
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
    onError: () =>
      message.error(locale === 'vi' ? 'Cập nhật thứ tự thất bại' : 'Update order failed'),
  });

  // === CHECK PERMISSIONS ===
  const canEdit = (record: Category) => currentUser?.id === record.creator_id;
  const canDelete = (record: Category) => currentUser?.id === record.creator_id;

  const handleMoveUp = (index: number) => {
    if (index === 0 || !canEdit(categories[index])) return;
    const newCategories = [...categories];
    [newCategories[index - 1], newCategories[index]] = [
      newCategories[index],
      newCategories[index - 1],
    ];
    const payload = newCategories.map((cat, idx) => ({ id: cat.id, order: idx + 1 }));
    updateOrderMutation.mutate(payload);
  };

  const handleMoveDown = (index: number) => {
    if (index === categories.length - 1 || !canEdit(categories[index])) return;
    const newCategories = [...categories];
    [newCategories[index], newCategories[index + 1]] = [
      newCategories[index + 1],
      newCategories[index],
    ];
    const payload = newCategories.map((cat, idx) => ({ id: cat.id, order: idx + 1 }));
    updateOrderMutation.mutate(payload);
  };

  const columns = [
    {
      title: locale === 'vi' ? 'STT' : 'No.',
      key: 'index',
      width: 60,
      align: 'center' as const,
      render: (_: any, __: any, index: number) => (
        <span style={{ fontWeight: 500 }}>
          {(pagination.page - 1) * pagination.pageSize + index + 1}
        </span>
      ),
    },
    {
      title: locale === 'vi' ? 'Tên (Tiếng Việt)' : 'Name (Vietnamese)',
      dataIndex: 'name_vi',
      key: 'name_vi',
      render: (text: string) => <strong style={{ fontSize: 14 }}>{text}</strong>,
    },
    {
      title: locale === 'vi' ? 'Tên (Tiếng Anh)' : 'Name (English)',
      dataIndex: 'name_en',
      key: 'name_en',
      render: (text: string) =>
        text ? (
          <span style={{ color: '#595959' }}>{text}</span>
        ) : (
          <Tag color="orange">{locale === 'vi' ? 'Chưa có' : 'Not set'}</Tag>
        ),
    },
    {
      title: 'Slug',
      dataIndex: 'slug',
      key: 'slug',
      render: (text: string) => (
        <code
          style={{
            background: '#f5f5f5',
            padding: '2px 8px',
            borderRadius: 4,
            fontSize: 12,
            color: '#1890ff',
          }}
        >
          {text}
        </code>
      ),
    },
    {
      title: locale === 'vi' ? 'Thứ tự' : 'Order',
      dataIndex: 'order',
      key: 'order',
      width: 140,
      align: 'center' as const,
      render: (order: number, record: Category, index: number) => (
        <Space size="small">
          <Button
            type="text"
            size="small"
            icon={<ArrowUpOutlined />}
            onClick={() => handleMoveUp(index)}
            disabled={index === 0 || !canEdit(record)}
            title={locale === 'vi' ? 'Di chuyển lên' : 'Move up'}
          />
          <span
            style={{
              minWidth: 24,
              textAlign: 'center',
              display: 'inline-block',
              fontWeight: 600,
              fontSize: 14,
            }}
          >
            {order}
          </span>
          <Button
            type="text"
            size="small"
            icon={<ArrowDownOutlined />}
            onClick={() => handleMoveDown(index)}
            disabled={index === categories.length - 1 || !canEdit(record)}
            title={locale === 'vi' ? 'Di chuyển xuống' : 'Move down'}
          />
        </Space>
      ),
    },
    {
      title: locale === 'vi' ? 'Hành động' : 'Actions',
      key: 'action',
      width: 120,
      align: 'center' as const,
      render: (_: any, record: Category) => (
        <Space size="small">
          <Button
            type="link"
            size="small"
            icon={<EditOutlined />}
            onClick={() => canEdit(record) && setEditingCategory(record)}
            disabled={!canEdit(record)}
            title={locale === 'vi' ? 'Chỉnh sửa' : 'Edit'}
          >
            {locale === 'vi' ? 'Sửa' : 'Edit'}
          </Button>
          <Popconfirm
            title={locale === 'vi' ? 'Xóa danh mục?' : 'Delete category?'}
            description={
              locale === 'vi'
                ? `Bạn có chắc muốn xóa "${record.name_vi}"?`
                : `Are you sure to delete "${record.name_en || record.name_vi}"?`
            }
            onConfirm={() => canDelete(record) && deleteMutation.mutate(record.id)}
            okText={locale === 'vi' ? 'Xóa' : 'Delete'}
            cancelText={locale === 'vi' ? 'Hủy' : 'Cancel'}
            okButtonProps={{ danger: true }}
          >
            <Button
              type="link"
              size="small"
              danger
              icon={<DeleteOutlined />}
              disabled={!canDelete(record)}
              title={locale === 'vi' ? 'Xóa' : 'Delete'}
            >
              {locale === 'vi' ? 'Xóa' : 'Delete'}
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <PageContainer
      title={locale === 'vi' ? 'Quản lý danh mục' : 'Category Management'}
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
            placeholder={locale === 'vi' ? 'Tìm kiếm tên danh mục...' : 'Search categories...'}
            onSearch={(value) => {
              setSearchKeyword(value);
              setPagination((prev) => ({ ...prev, page: 1 }));
            }}
            allowClear
            enterButton
            style={{ width: 320 }}
          />
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => router.push('/admin/categories/create')}
          >
            {locale === 'vi' ? 'Tạo danh mục' : 'Create Category'}
          </Button>
        </div>
      }
    >
      <div style={{ background: '#fff', padding: 24, borderRadius: 8 }}>
        <Table
          columns={columns}
          dataSource={categories}
          rowKey="id"
          loading={isLoading || deleteMutation.isPending || updateOrderMutation.isPending}
          pagination={{
            current: pagination.page,
            pageSize: pagination.pageSize,
            total: paginationData?.totalItem,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) =>
              locale === 'vi' ? `Tổng ${total} danh mục` : `Total ${total} categories`,
            pageSizeOptions: ['10', '20', '50'],
            onChange: (page, pageSize) => setPagination({ page, pageSize }),
          }}
          scroll={{ x: 800 }}
        />
      </div>

      <CategoryEdit
        open={!!editingCategory}
        onClose={() => setEditingCategory(null)}
        category={editingCategory}
        onUpdate={() => queryClient.invalidateQueries({ queryKey: ['categories'] })}
      />
    </PageContainer>
  );
}
