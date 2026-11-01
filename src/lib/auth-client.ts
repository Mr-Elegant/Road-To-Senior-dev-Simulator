'use client';

import { createAuthClient } from 'better-auth/react';

// Same-origin cookies; no credential or session token is persisted in localStorage.
export const authClient = createAuthClient();
