'use client';

import React, { useState, useEffect } from 'react';
import { PageContainer, DragSortTable } from '@ant-design/pro-components';
import type { ProColumns } from '@ant-design/pro-components';
import { Button, Space, message, Popconfirm, Input, Tag } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
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
  const locale = useLocale();
  const queryClient = useQueryClient();
  const { currentUser } = useAuthStore();

  const [searchKeyword, setSearchKeyword] = useState('');
  const [pagination, setPagination] = useState({ page: 1, pageSize: 10 });
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [dataSource, setDataSource] = useState<Category[]>([]);
  const [messageApi, contextHolder] = message.useMessage();

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

  // Sắp xếp dataSource theo order khi fetch xong
  useEffect(() => {
    if (categories.length > 0) {
      const sorted = [...categories].sort((a, b) => a.order - b.order);
      setDataSource(sorted);
    }
  }, [categories]);

  // === DELETE MUTATION ===
  const deleteMutation = useMutation({
    mutationFn: (id: string) => categoryService.deleteCategory(id),
    onSuccess: () => {
  setTimeout(() => {
    message.success(
      locale === 'vi' ? 'Cập nhật thứ tự thành công!' : 'Order updated successfully!'
    );
  }, 0);
  queryClient.invalidateQueries({ queryKey: ['categories'] });
}

    onError: () => messageApi.error(locale === 'vi' ? 'Xóa thất bại' : 'Delete failed'),
  });

  // === UPDATE ORDER MUTATION ===
  const updateOrderMutation = useMutation({
    mutationFn: (payload: { id: number; order: number }[]) => categoryService.updateOrder(payload),
    onSuccess: () => {
      messageApi.success(
        locale === 'vi' ? 'Cập nhật thứ tự thành công!' : 'Order updated successfully!'
      );
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
    onError: () => {
      messageApi.error(locale === 'vi' ? 'Cập nhật thứ tự thất bại' : 'Update order failed');
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });

  // === CHECK PERMISSIONS ===
  const canEdit = (record: Category) => currentUser?.id === record.creator_id;
  const canDelete = (record: Category) => currentUser?.id === record.creator_id;

  // === HANDLE DRAG SORT ===
  const handleDragSortEnd = (
    beforeIndex: number,
    afterIndex: number,
    newDataSource: Category[]
  ) => {
    // Cập nhật UI ngay
    setDataSource(newDataSource);

    // Tạo payload: id + order mới
    const payload = newDataSource.map((cat, idx) => ({
      id: Number(cat.id),
      order: idx + 1, // order theo vị trí mới
    }));

    updateOrderMutation.mutate(payload);
  };

  // === TABLE COLUMNS ===
  const columns: ProColumns<Category>[] = [
    {
      title: locale === 'vi' ? 'Sắp xếp' : 'Sort',
      dataIndex: 'sort',
      width: 60,
      className: 'drag-visible',
    },
    {
      title: locale === 'vi' ? 'Tên (Tiếng Việt)' : 'Name (Vietnamese)',
      dataIndex: 'name_vi',
      key: 'name_vi',
      width: 250,
      ellipsis: true,
      render: (text: any) => <strong style={{ fontSize: 14 }}>{text}</strong>,
    },
    {
      title: locale === 'vi' ? 'Tên (Tiếng Anh)' : 'Name (English)',
      dataIndex: 'name_en',
      key: 'name_en',
      width: 250,
      ellipsis: true,
      render: (text: any) =>
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
      width: 200,
      ellipsis: true,
      render: (text: any) => (
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
      title: locale === 'vi' ? 'Hành động' : 'Actions',
      key: 'action',
      width: 140,
      align: 'center',
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
          <Space.Compact style={{ width: 320 }}>
            <Input
              placeholder={locale === 'vi' ? 'Tìm kiếm tên danh mục...' : 'Search categories...'}
              allowClear
              onPressEnter={(e) => setSearchKeyword((e.target as HTMLInputElement).value)}
              size="middle"
            />
            <Button
              type="primary"
              onClick={() => {
                const input = document.querySelector<HTMLInputElement>('.ant-input')!;
                setSearchKeyword(input.value);
                setPagination((prev) => ({ ...prev, page: 1 }));
              }}
            >
              {locale === 'vi' ? 'Tìm kiếm' : 'Search'}
            </Button>
          </Space.Compact>

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
        <DragSortTable<Category>
          columns={columns}
          rowKey="id"
          search={false}
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
          loading={isLoading || deleteMutation.isPending || updateOrderMutation.isPending}
          dataSource={dataSource}
          dragSortKey="sort"
          onDragSortEnd={handleDragSortEnd}
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
