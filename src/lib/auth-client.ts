'use client';

import { createAuthClient } from 'better-auth/react';
import { sessionFetch } from './auth/sessionFetch';

// Same-origin cookies; no credential or session token is persisted in localStorage.
export const authClient = createAuthClient({ fetchOptions: { customFetchImpl: sessionFetch } });
