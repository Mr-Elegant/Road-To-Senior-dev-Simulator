// Corrected review reference: app/layout.tsx
import type { ReactNode } from 'react';
export default function RootLayout({ children }: { children: ReactNode }) {
  return <html lang="en"><body><nav aria-label="Main">Engineering Lab</nav><main>{children}</main></body></html>;
}
