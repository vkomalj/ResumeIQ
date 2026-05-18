'use client';

import React from 'react';
import { Toaster } from 'sonner';

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <>
      {children}
      <Toaster
        position="top-right"
        theme="dark"
        richColors
        expand
        closeButton
        icons={{
          success: '✓',
          error: '✕',
          warning: '⚠',
          info: 'ℹ',
          loading: '⟳',
        }}
      />
    </>
  );
}
