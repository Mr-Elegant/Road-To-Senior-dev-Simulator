import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/components/layout/ThemeProvider';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ClientErrorBoundary } from '@/components/common/ClientErrorBoundary';
import { AuthBoundary } from '@/components/auth/AuthBoundary';

export const metadata: Metadata = {
  title: 'Full Stack Engineering Interview Lab | Senior & Staff Simulator',
  description:
    'Interactive engineering interview and simulation platform for senior, staff, and lead full-stack engineers. Debugging, production incidents, system design, and code review scenarios.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <body className="bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 min-h-screen flex flex-col">
        <ClientErrorBoundary>
          <ThemeProvider>
            <AuthBoundary>
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
            </AuthBoundary>
          </ThemeProvider>
        </ClientErrorBoundary>
      </body>
    </html>
  );
}

