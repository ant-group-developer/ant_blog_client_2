"use client";

import { useState } from "react";
import { usePosts } from "@/hooks/usePosts";
import { useCategories } from "@/hooks/useCategories";
import Link from "next/link";
import {
  Table,
  Input,
  Button,
  Select,
  Space,
  Popconfirm,
  message,
  Typography,
} from "antd";
import {
  PlusOutlined,
  DeleteOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { Category } from "@/types";

const { Title, Text } = Typography;

export default function PostsPage() {
  const {
    data,
    total,
    page,
    setPage,
    search,
    setSearch,
    categoryId,
    setCategoryId,
    isLoading,
    remove,
  } = usePosts();

  const categories = useCategories();
  const [searchInput, setSearchInput] = useState(search);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleSearch = () => {
    setSearch(searchInput);
    setPage(1);
  };

  const handleDelete = async (id: string) => {
    try {
      setLoadingId(id);
      await remove(id);
      message.success("Đã xóa bài viết");
    } catch (err) {
      message.error("Xóa thất bại");
    } finally {
      setLoadingId(null);
    }
  };

  const columns = [
    {
      title: "Tiêu đề",
      dataIndex: "title_vi",
      key: "title_vi",
      render: (text: string, record: any) => (
        <Link
          href={`/admin/posts/${record.id}`}
          style={{ textDecoration: "none" }}
        >
          <Text underline>{text}</Text>
        </Link>
      ),
    },
    {
      title: "Danh mục",
      dataIndex: "category_id",
      key: "category_id",
      render: (id: string) => {
        const category = categories.data.find(
          (c: Category) => c.id === BigInt(id)
        );
        return category ? category.name_vi : "N/A";
      },
    },
    {
      title: "Ngày tạo",
      dataIndex: "created_at",
      key: "created_at",
      render: (val: string) => new Date(val).toLocaleDateString("vi-VN"),
    },
    {
      title: "Thao tác",
      key: "actions",
      align: "right" as const,
      render: (record: any) => (
        <Popconfirm
          title="Xóa bài viết này?"
          onConfirm={() => handleDelete(record.id)}
          okText="Xóa"
          cancelText="Hủy"
        >
          <Button
            danger
            type="text"
            loading={loadingId === record.id}
            icon={<DeleteOutlined />}
          />
        </Popconfirm>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Space
        align="center"
        style={{
          width: "100%",
          justifyContent: "space-between",
          marginBottom: 24,
        }}
      >
        <Title level={3}>Quản lý bài viết</Title>
        <Link href="/admin/posts/new">
          <Button type="primary" icon={<PlusOutlined />}>
            Thêm bài viết
          </Button>
        </Link>
      </Space>

      <Space
        style={{
          marginBottom: 16,
          width: "100%",
          justifyContent: "space-between",
        }}
      >
        <Space>
          <Input
            placeholder="Tìm kiếm bài viết..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onPressEnter={handleSearch}
            prefix={<SearchOutlined />}
            style={{ width: 250 }}
          />
          <Button onClick={handleSearch}>Tìm kiếm</Button>
        </Space>

        <Select
          allowClear
          placeholder="Tất cả danh mục"
          value={categoryId || undefined}
          onChange={(val) => {
            setCategoryId(val || "");
            setPage(1);
          }}
          style={{ width: 200 }}
          options={[
            { label: "Tất cả danh mục", value: "" },
            ...categories.data.map((cat: Category) => ({
              label: cat.name_vi,
              value: cat.id,
            })),
          ]}
        />
      </Space>

      <Table
        loading={isLoading}
        columns={columns}
        dataSource={data}
        rowKey="id"
        pagination={{
          current: page,
          total,
          pageSize: 10,
          onChange: (p) => setPage(p),
          showTotal: (t) => `Tổng ${t} bài viết`,
        }}
      />
    </div>
  );
}
