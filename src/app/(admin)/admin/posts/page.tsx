'use client';

import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { ProTable, TableDropdown, type ProColumns } from '@ant-design/pro-components';
import { Avatar, message, Space, Image, Tag, Button, Input } from 'antd';
import { EditOutlined, FileTextOutlined, PictureOutlined, PlusOutlined } from '@ant-design/icons';
import { usePosts, useUpdatePost } from '@/hooks/usePosts';
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
  const locale = useLocale(); // 'vi' | 'en'
  const { currentUser } = useAuthStore();

  const [params, setParams] = useState({
    page: 1,
    pageSize: 10,
    keyword: '',
  });

  const { data, isLoading } = usePosts(params);
  const updateMutation = useUpdatePost();

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

  const columns: ProColumns<Post>[] = [
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
      title: locale === 'vi' ? 'Bài viết' : 'Post',
      dataIndex: 'title_vi',
      fieldProps: { placeholder: locale === 'vi' ? 'Tìm theo tiêu đề...' : 'Search by title...' },
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
            <div style={{ maxWidth: 300 }}>
              <div>
                <strong>{title}</strong>
                {currentUser?.id === record.creator_id && (
                  <Tag color="blue" style={{ marginLeft: 8 }}>
                    {locale === 'vi' ? 'Bạn' : 'You'}
                  </Tag>
                )}
              </div>
              {description && (
                <div style={{ fontSize: 11, color: '#aaa', marginTop: 2 }}>
                  {description.slice(0, 50)}...
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
      width: 80,
      fixed: 'right',
      search: false,
      render: (_, record) => {
        const isOwner = currentUser?.id === record.creator_id;
        return (
          <TableDropdown
            menus={[
              {
                key: 'edit',
                name: locale === 'vi' ? 'Sửa' : 'Edit',
                icon: <EditOutlined />,
                onClick: () => setEditingPost(record),
                disabled: !isOwner,
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
        title="Quản lý bài viết"
        breadcrumb={undefined} // ← xóa span Dashboard / Post
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
              placeholder="Tìm kiếm bài viết..."
              onSearch={(value) => {
                setParams((prev) => ({ ...prev, keyword: value, page: 1 }));
              }}
              allowClear
              enterButton
              style={{ width: 320 }}
            />
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
            onSubmit={(values: { title_vi?: string }) =>
              setParams((p) => ({ ...p, keyword: values.title_vi || '', page: 1 }))
            }
            onReset={() => setParams((p) => ({ ...p, keyword: '', page: 1 }))}
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
