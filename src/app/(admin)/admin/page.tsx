'use client';

import React from 'react';
import AdminLayout from './layout';

export default function AdminPage() {
  return (
    <AdminLayout>
      {/* Nội dung trống, chỉ hiển thị khung */}
      <div
        style={{
          minHeight: '400px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <h2>Welcome to Admin Dashboard</h2>
      </div>
    </AdminLayout>
  );
}
