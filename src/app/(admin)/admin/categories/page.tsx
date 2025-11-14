'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { PageContainer, DragSortTable } from '@ant-design/pro-components';
import type { ProColumns } from '@ant-design/pro-components';
import { Button, Space, message, Popconfirm, Input, Tag } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';

import { categoryService } from '@/service/categoryService';
import { Category } from '@/types';
import CategoryEdit from '@/components/category/CategoryEdit';
import { useAuthStore } from '@/store/authStore';

export default function CategoriesPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { currentUser } = useAuthStore();
  const [searchKeyword, setSearchKeyword] = useState('');
  const [pagination, setPagination] = useState({ page: 1, pageSize: 10 });
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [dataSource, setDataSource] = useState<Category[]>([]);
  const [messageApi, contextHolder] = message.useMessage();
  const t = useTranslations('categoryList');

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

  const categories = useMemo(() => data?.data || [], [data?.data]);
  const paginationData = data?.pagination;

  useEffect(() => {
    if (categories.length > 0) {
      const sorted = [...categories].sort((a, b) => a.order - b.order);
      setDataSource(sorted);
    }
  }, [categories]);

  const deleteMutation = useMutation({
    mutationFn: (id: string) => categoryService.deleteCategory(id),
    onSuccess: () => {
      setTimeout(() => {
        messageApi.success(t('deleteSuccess'));
      }, 0);
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
    onError: () => messageApi.error(t('deleteFailed')),
  });

  const updateOrderMutation = useMutation({
    mutationFn: (payload: { id: number; order: number }[]) => categoryService.updateOrder(payload),
    onSuccess: () => {
      messageApi.success(t('updateOrderSuccess'));
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
    onError: () => {
      messageApi.error(t('updateOrderFailed'));
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });

  const canEdit = (record: Category) => currentUser?.id === record.creator_id;
  const canDelete = (record: Category) => currentUser?.id === record.creator_id;

  const handleDragSortEnd = (
    beforeIndex: number,
    afterIndex: number,
    newDataSource: Category[]
  ) => {
    setDataSource(newDataSource);
    const payload = newDataSource.map((cat, idx) => ({
      id: Number(cat.id),
      order: idx + 1,
    }));
    updateOrderMutation.mutate(payload);
  };

  const columns: ProColumns<Category>[] = [
    {
      title: t('sort'),
      dataIndex: 'sort',
      width: 60,
      className: 'drag-visible',
    },
    {
      title: t('nameVi'),
      dataIndex: 'name_vi',
      key: 'name_vi',
      width: 250,
      ellipsis: true,
      render: (dom: React.ReactNode) => <strong style={{ fontSize: 14 }}>{dom}</strong>,
    },
    {
      title: t('nameEn'),
      dataIndex: 'name_en',
      key: 'name_en',
      width: 250,
      ellipsis: true,
      render: (dom: React.ReactNode) =>
        dom ? (
          <span style={{ color: '#595959' }}>{dom}</span>
        ) : (
          <Tag color="orange">{t('notSet')}</Tag>
        ),
    },
    {
      title: t('slug'),
      dataIndex: 'slug',
      key: 'slug',
      width: 200,
      ellipsis: true,
      render: (dom: React.ReactNode) => (
        <code
          style={{
            background: '#f5f5f5',
            padding: '2px 8px',
            borderRadius: 4,
            fontSize: 12,
            color: '#1890ff',
          }}
        >
          {dom}
        </code>
      ),
    },
    {
      title: t('actions'),
      key: 'action',
      width: 140,
      align: 'center',
      render: (_: unknown, record: Category) => (
        <Space size="small">
          <Button
            type="link"
            size="small"
            icon={<EditOutlined />}
            onClick={() => canEdit(record) && setEditingCategory(record)}
            disabled={!canEdit(record)}
            title={t('edit')}
          >
            {t('edit')}
          </Button>
          <Popconfirm
            title={t('confirmDeleteTitle')}
            description={t('confirmDeleteDescription')}
            onConfirm={() => canDelete(record) && deleteMutation.mutate(record.id)}
            okText={t('delete')}
            cancelText={t('cancel')}
            okButtonProps={{ danger: true }}
          >
            <Button
              type="link"
              size="small"
              danger
              icon={<DeleteOutlined />}
              disabled={!canDelete(record)}
              title={t('delete')}
            >
              {t('delete')}
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <PageContainer
      title={t('categoryManagement')}
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
              {t('searchButton')}
            </Button>
          </Space.Compact>

          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => router.push('/admin/categories/create')}
          >
            {t('createCategory')}
          </Button>
        </div>
      }
    >
      {contextHolder}
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
            showTotal: (total) => `${total} ${t('totalCategories')}`,
            pageSizeOptions: ['10', '20', '50'],
            onChange: (page, pageSize) => setPagination({ page, pageSize }),
          }}
          scroll={{ x: 800 }}
          loading={isLoading || deleteMutation.isPending}
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
