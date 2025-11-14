'use client';

import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { ProTable, type ProColumns, PageContainer } from '@ant-design/pro-components';
import { Avatar, message, Space, Image, Button, Input, Popconfirm } from 'antd';
import { EditOutlined, PictureOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { usePosts, useUpdatePost, useDeletePost } from '@/hooks/usePosts';
import { useAuthStore } from '@/store/authStore';
import PostEdit from '@/components/post/PostEdit';
import { Post } from '@/types';
import { useTranslations } from 'next-intl';

const { Search } = Input;

export default function PostListPage() {
  const router = useRouter();
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [messageApi, contextHolder] = message.useMessage();
  const { currentUser } = useAuthStore();

  const [params, setParams] = useState({
    page: 1,
    pageSize: 10,
    keyword: '',
  });

  const { data, isLoading } = usePosts(params);
  const updateMutation = useUpdatePost();
  const deleteMutation = useDeletePost();
  const t = useTranslations('postList');

  const handleUpdate = (post: Post) => {
    updateMutation.mutate(
      { id: post.id, payload: post },
      {
        onSuccess: () => {
          messageApi.success(t('updateSuccess'));
          setEditingPost(null);
        },
        onError: (err: any) => {
          messageApi.error(err.response?.data?.message || t('updateFailed'));
        },
      }
    );
  };

  const handleDelete = (post: Post) => {
    deleteMutation.mutate(post.id, {
      onSuccess: () => {
        messageApi.success(t('deleteSuccess'));
        setParams((p) => ({ ...p })); // trigger refetch
      },
      onError: (err: any) => {
        messageApi.error(err.response?.data?.message || t('deleteFailed'));
      },
    });
  };

  const columns: ProColumns<Post>[] = [
    {
      title: t('id'),
      dataIndex: 'id',
      width: 80,
      search: false,
      render: (id) => (
        <span style={{ fontFamily: 'monospace', fontSize: 12 }}>{String(id).slice(0, 8)}...</span>
      ),
    },
    {
      title: t('post'),
      dataIndex: 'title_vi',
      width: 320,
      render: (_, record) => (
        <Space>
          {record.thumbnail ? (
            <Image
              src={record.thumbnail}
              width={40}
              height={40}
              style={{ objectFit: 'cover', borderRadius: 4 }}
              preview={false}
            />
          ) : (
            <Avatar size={40} icon={<PictureOutlined />} />
          )}
          <div style={{ maxWidth: 260 }}>
            <div
              style={{
                fontWeight: 500,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {record.title_vi}
            </div>
            {record.description_vi && (
              <div
                style={{
                  fontSize: 11,
                  color: '#aaa',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {record.description_vi}
              </div>
            )}
          </div>
        </Space>
      ),
    },
    {
      title: t('createdAt'),
      dataIndex: 'created_at',
      width: 160,
      search: false,
      render: (_, record) =>
        record.created_at ? new Date(record.created_at).toLocaleString() : '-',
    },
    {
      title: t('updatedAt'),
      dataIndex: 'updated_at',
      width: 160,
      search: false,
      render: (_, record) =>
        record.updated_at ? new Date(record.updated_at).toLocaleString() : '-',
    },
    {
      title: t('actions'),
      key: 'action',
      width: 140,
      fixed: 'right',
      search: false,
      render: (_, record) => {
        const isOwner = currentUser?.id === record.creator_id;
        return (
          <Space size="small">
            <Button
              type="link"
              size="small"
              icon={<EditOutlined />}
              onClick={() => setEditingPost(record)}
              disabled={!isOwner}
            >
              {t('edit')}
            </Button>
            <Popconfirm
              title={t('deletePostTitle')}
              description={t('deletePostDescription', {
                title: record.title_vi,
              })}
              onConfirm={() => handleDelete(record)}
              okText={t('delete')}
              cancelText={t('deleteCancel')}
              okButtonProps={{ danger: true }}
            >
              <Button type="link" size="small" danger icon={<DeleteOutlined />} disabled={!isOwner}>
                {t('delete')}
              </Button>
            </Popconfirm>
          </Space>
        );
      },
    },
  ];

  return (
    <>
      {contextHolder}
      <PageContainer
        title={t('postManagement')}
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
                onPressEnter={(e) => {
                  const value = (e.target as HTMLInputElement).value;
                  setParams((p) => ({ ...p, keyword: value, page: 1 }));
                }}
              />
              <Button
                type="primary"
                onClick={() => {
                  const input = document.querySelector<HTMLInputElement>('.ant-input')!;
                  setParams((p) => ({ ...p, keyword: input.value, page: 1 }));
                }}
              >
                {t('search')}
              </Button>
            </Space.Compact>

            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => router.push('/admin/posts/create')}
            >
              {t('createPost')}
            </Button>
          </div>
        }
      >
        <div style={{ background: '#fff', padding: 24, borderRadius: 8 }}>
          <ProTable<Post>
            columns={columns}
            rowKey="id"
            dataSource={data?.data}
            loading={isLoading || deleteMutation.isPending}
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

      <PostEdit
        open={!!editingPost}
        onClose={() => setEditingPost(null)}
        post={editingPost}
        onUpdate={handleUpdate}
      />
    </>
  );
}
