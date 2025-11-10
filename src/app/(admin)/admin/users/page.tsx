"use client";

import React, { useState } from "react";
import { useUsers } from "@/hooks/useUsers";
import {
  Table,
  Input,
  Button,
  Modal,
  Form,
  Space,
  Spin,
  Pagination,
  message,
  Tag,
  Typography,
} from "antd";
import { SearchOutlined, PlusOutlined, UserOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { User } from "@/types/index"; // Import đúng type User từ index.ts

const { Search } = Input;
const { Text } = Typography;

export default function UserListPage() {
  const {
    data: users,
    total,
    page,
    setPage,
    search,
    setSearch,
    isLoading,
    create,
  } = useUsers();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  const pageSize = 10;

  const handleSearch = (value: string) => {
    setSearch(value.trim());
    setPage(1);
  };

  const handleCreate = () => {
    form.validateFields().then((values) => {
      create(
        {
          ...values,
          status: true, // Mặc định active
        },
        {
          onSuccess: () => {
            message.success("Tạo người dùng thành công!");
            setIsModalOpen(false);
            form.resetFields();
          },
          onError: (error: any) => {
            message.error(error?.message || "Tạo thất bại!");
          },
        }
      );
    });
  };

  const columns: ColumnsType<User> = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 100,
      sorter: (a, b) => a.id.localeCompare(b.id),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      render: (email) => <Text strong>{email}</Text>,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 100,
      render: (status) => (
        <Tag color={status ? "green" : "red"}>
          {status ? "Hoạt động" : "Vô hiệu"}
        </Tag>
      ),
    },
    {
      title: "Người tạo",
      dataIndex: "creator_id",
      key: "creator_id",
      width: 120,
      render: (id) =>
        id ? <Text type="secondary">{id}</Text> : <Text type="danger">—</Text>,
    },
    {
      title: "Người sửa",
      dataIndex: "modifier_id",
      key: "modifier_id",
      width: 120,
      render: (id) =>
        id ? <Text type="secondary">{id}</Text> : <Text type="warning">—</Text>,
    },
    {
      title: "Tạo lúc",
      dataIndex: "created_at",
      key: "created_at",
      width: 180,
      render: (date) => new Date(date).toLocaleString("vi-VN"),
    },
    {
      title: "Cập nhật lúc",
      dataIndex: "updated_at",
      key: "updated_at",
      width: 180,
      render: (date) => new Date(date).toLocaleString("vi-VN"),
    },
  ];

  return (
    <>
      <div style={{ padding: 24, background: "#f0f2f5", minHeight: "100vh" }}>
        <div
          style={{
            background: "#fff",
            padding: 24,
            borderRadius: 8,
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          }}
        >
          {/* Header */}
          <div
            style={{
              marginBottom: 16,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <h2 style={{ margin: 0, fontSize: 24 }}>
              <UserOutlined style={{ marginRight: 8 }} />
              Quản lý người dùng
            </h2>
            <Button
              type="primary"
              size="large"
              icon={<PlusOutlined />}
              onClick={() => setIsModalOpen(true)}
            >
              Thêm người dùng
            </Button>
          </div>

          {/* Tìm kiếm */}
          <div style={{ marginBottom: 16 }}>
            <Search
              placeholder="Tìm kiếm theo email..."
              allowClear
              enterButton={<SearchOutlined />}
              size="large"
              onSearch={handleSearch}
              defaultValue={search}
              style={{ width: 400 }}
            />
          </div>

          {/* Bảng */}
          <Spin spinning={isLoading}>
            <Table
              columns={columns}
              dataSource={users}
              rowKey="id"
              pagination={false}
              scroll={{ x: 1200 }}
              locale={{ emptyText: "Không tìm thấy người dùng nào" }}
            />
          </Spin>

          {/* Phân trang */}
          {total > 0 && (
            <div
              style={{
                marginTop: 24,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div style={{ color: "#666" }}>
                Hiển thị {(page - 1) * pageSize + 1} -{" "}
                {Math.min(page * pageSize, total)} / {total} người dùng
              </div>
              <Pagination
                current={page}
                total={total}
                pageSize={pageSize}
                onChange={(p) => setPage(p)}
                showSizeChanger={false}
                showQuickJumper
              />
            </div>
          )}
        </div>
      </div>

      {/* Modal: Thêm người dùng */}
      <Modal
        title="Thêm người dùng mới"
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          form.resetFields();
        }}
        onOk={handleCreate}
        okText="Tạo"
        cancelText="Hủy"
        width={500}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Vui lòng nhập email!" },
              { type: "email", message: "Email không hợp lệ!" },
            ]}
          >
            <Input prefix={<UserOutlined />} placeholder="user@example.com" />
          </Form.Item>

          <Form.Item
            name="password"
            label="Mật khẩu"
            rules={[
              { required: true, message: "Vui lòng nhập mật khẩu!" },
              { min: 6, message: "Mật khẩu ít nhất 6 ký tự!" },
            ]}
          >
            <Input.Password placeholder="Nhập mật khẩu" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
