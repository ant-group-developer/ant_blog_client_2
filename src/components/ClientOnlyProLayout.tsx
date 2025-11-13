'use client';

import { ProLayout } from '@ant-design/pro-components';
import { useState, useEffect } from 'react';
import type { ProLayoutProps } from '@ant-design/pro-components';

export default function ClientOnlyProLayout(props: ProLayoutProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Hiển thị skeleton hoặc loading đơn giản
    return (
      <div
        style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        <div>Loading...</div>
      </div>
    );
  }

  return <ProLayout {...props} />;
}
