'use client';

import { createContext, useContext } from 'react';

// Undefined means identity has not been resolved. Null is a resolved visitor.
export const WorkspaceScope = createContext<{ accountId: string | null | undefined; ready: boolean }>({ accountId: undefined, ready: false });
export function useWorkspaceScope() { return useContext(WorkspaceScope); }
