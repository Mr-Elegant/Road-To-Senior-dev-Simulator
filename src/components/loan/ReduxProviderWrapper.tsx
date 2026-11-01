'use client';

import React from 'react';
import { Provider } from 'react-redux';
import { store } from '@/lib/redux/store';

export function ReduxProviderWrapper({ children }: { children: React.ReactNode }) {
  return <Provider store={store}>{children}</Provider>;
}

