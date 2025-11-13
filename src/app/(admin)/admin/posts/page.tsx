'use client';

import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { ProTable, type ProColumns } from '@ant-design/pro-components';
import { Avatar, message, Space, Image, Tag, Button, Input, Popconfirm } from 'antd';
import { EditOutlined, PictureOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { usePosts, useUpdatePost, useDeletePost } from '@/hooks/usePosts';
import { useAuthStore } from '@/store/authStore';
import PostEdit from '@/components/post/PostEdit';
import { Post } from '@/types';
import { useLocale } from 'next-intl';
import { PageContainer } from '@ant-design/pro-components';

const { Search } = Input;

export default function PostListPage() {
  const router = useRouter();
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [messageApi, contextHolder] = message.useMessage();
  const locale = useLocale();
  const { currentUser } = useAuthStore();

  const [params, setParams] = useState({
    page: 1,
    pageSize: 10,
    keyword: '',
  });

  const { data, isLoading } = usePosts(params);
  const updateMutation = useUpdatePost();
  const deleteMutation = useDeletePost();

  const handleUpdate = (post: Post) => {
    updateMutation.mutate(
      { id: post.id, payload: post },
      {
        onSuccess: () => {
          messageApi.success(locale === 'vi' ? 'Cập nhật thành công!' : 'Updated successfully!');
          setEditingPost(null);
        },
        onError: (err: any) => {
          messageApi.error(
            err.response?.data?.message || (locale === 'vi' ? 'Cập nhật thất bại' : 'Update failed')
          );
        },
      }
    );
  };

  const handleDelete = (post: Post) => {
    deleteMutation.mutate(post.id, {
      onSuccess: () => {
        messageApi.success(
          locale === 'vi' ? 'Xóa bài viết thành công!' : 'Post deleted successfully!'
        );
        setParams((p) => ({ ...p })); // trigger refetch
      },
      onError: (err: any) => {
        messageApi.error(
          err.response?.data?.message || (locale === 'vi' ? 'Xóa thất bại' : 'Delete failed')
        );
      },
    });
  };

  const columns: ProColumns<Post>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      width: 80,
      search: false,
      render: (id) => (
        <span style={{ fontFamily: 'monospace', fontSize: 12 }}>{String(id).slice(0, 8)}...</span>
      ),
    },
    {
      title: locale === 'vi' ? 'Bài viết' : 'Post',
      dataIndex: 'title_vi',
      width: 320,
      render: (_, record) => {
        const title = locale === 'vi' ? record.title_vi : record.title_en || record.title_vi;
        const description =
          locale === 'vi' ? record.description_vi : record.description_en || record.description_vi;
        return (
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
                {title}
              </div>
              {description && (
                <div
                  style={{
                    fontSize: 11,
                    color: '#aaa',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {description}
                </div>
              )}
            </div>
          </Space>
        );
      },
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
              {locale === 'vi' ? 'Sửa' : 'Edit'}
            </Button>
            <Popconfirm
              title={locale === 'vi' ? 'Xóa bài viết?' : 'Delete post?'}
              description={
                locale === 'vi'
                  ? `Bạn có chắc muốn xóa "${record.title_vi}"?`
                  : `Are you sure to delete "${record.title_en || record.title_vi}"?`
              }
              onConfirm={() => handleDelete(record)}
              okText={locale === 'vi' ? 'Xóa' : 'Delete'}
              cancelText={locale === 'vi' ? 'Hủy' : 'Cancel'}
              okButtonProps={{ danger: true }}
            >
              <Button type="link" size="small" danger icon={<DeleteOutlined />} disabled={!isOwner}>
                {locale === 'vi' ? 'Xóa' : 'Delete'}
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
        title={locale === 'vi' ? 'Quản lý bài viết' : 'Post Management'}
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
                placeholder={locale === 'vi' ? 'Tìm kiếm bài viết...' : 'Search posts...'}
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
                {locale === 'vi' ? 'Tìm kiếm' : 'Search'}
              </Button>
            </Space.Compact>

            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => router.push('/admin/posts/create')}
            >
              {locale === 'vi' ? 'Tạo bài viết' : 'Create Post'}
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
