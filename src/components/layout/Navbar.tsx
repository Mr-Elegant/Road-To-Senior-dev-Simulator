'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Terminal,
  BookOpen,
  BarChart3,
  Settings,
  Sun,
  Moon,
  Flame,
  CheckCircle2,
  Bookmark,
  Code2,
  Sparkles,
  Landmark,
  GraduationCap,
  Menu,
  X,
  Compass,
  Database,
} from 'lucide-react';
import { useTheme } from './ThemeProvider';
import { storage } from '@/lib/persistence/localStorageAdapter';
import { UserProgressData } from '@/types/userProgress';

export function Navbar() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [progress, setProgress] = useState<UserProgressData | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    let mounted = true;
    const fetchProgress = () => {
      storage
        .getProgress()
        .then((data) => {
          if (mounted) setProgress(data);
        })
        .catch((e) => {
          console.warn('Navbar: failed to load progress', e);
        });
    };
    fetchProgress();
    const interval = setInterval(fetchProgress, 3000);
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, [pathname]);

  // Close mobile menu on navigation
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const navItems = [
    { label: 'Dashboard', href: '/', icon: Terminal },
    { label: 'Beginner Track', href: '/interview?tier=tier-1', icon: GraduationCap, badge: 'Tier 1' },
    { label: 'SQL & Postgres Lab', href: '/sql', icon: Database, badge: '120 Qs' },
    { label: 'Challenges', href: '/library', icon: BookOpen },
    { label: 'Coding Practice', href: '/practice', icon: Code2 },
    { label: 'Loan Dashboard', href: '/challenges/loan-management', icon: Landmark, badge: 'Redux' },
    { label: 'AI Interview', href: '/interview', icon: Sparkles, badge: 'Gemini' },
    { label: 'Progress & Analytics', href: '/progress', icon: BarChart3 },
    { label: 'Settings', href: '/settings', icon: Settings },
  ];

  const safePathname = pathname || '';

  const completedCount = new Set(
    (progress?.attempts || [])
      .filter((a) => a && typeof a.totalScorePercentage === 'number' && a.totalScorePercentage >= 70)
      .map((a) => a.scenarioId)
  ).size;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-200/80 dark:border-zinc-800/80 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-3 group flex-shrink-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 group-hover:shadow-indigo-500/35 transition-all">
            <Terminal className="w-5 h-5" />
          </div>
          <div className="hidden min-[400px]:block">
            <div className="font-bold text-zinc-900 dark:text-zinc-100 text-sm leading-tight tracking-tight flex items-center gap-1.5">
              <span>Full Stack Interview Lab</span>
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <div className="text-[11px] text-zinc-500 dark:text-zinc-400 font-mono tracking-tight">
              Senior & Staff Simulator
            </div>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden xl:flex items-center gap-0.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === '/'
                ? safePathname === '/'
                : safePathname === item.href || (item.href !== '/' && !item.href.includes('?') && safePathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all ${
                  isActive
                    ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-950 dark:text-white font-semibold shadow-xs'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100/60 dark:hover:bg-zinc-800/50'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-zinc-400 dark:text-zinc-500'}`} />
                <span>{item.label}</span>
                {item.badge && (
                  <span className={`text-[9px] px-1 py-0.2 rounded font-mono font-semibold uppercase tracking-wider ${
                    isActive
                      ? 'bg-blue-500/15 text-blue-700 dark:text-blue-300'
                      : 'bg-zinc-200/60 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Compressed Desktop Nav for Large Screens (1024px - 1280px) */}
        <nav className="hidden lg:flex xl:hidden items-center gap-1">
          {navItems.slice(0, 5).map((item) => {
            const Icon = item.icon;
            const isActive = item.href === '/' ? safePathname === '/' : safePathname.startsWith(item.href.split('?')[0]);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`px-2 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1 transition-colors ${
                  isActive
                    ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-950 dark:text-white font-semibold'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100/50 dark:hover:bg-zinc-800/40'
                }`}
              >
                <Icon className="w-3.5 h-3.5 text-blue-500" />
                <span>{item.label}</span>
              </Link>
            );
          })}
          <Link
            href="/interview"
            className="px-2 py-1.5 rounded-lg text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 flex items-center gap-1"
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-500" />
            <span>AI Interview</span>
          </Link>
        </nav>

        {/* Right side widgets: streak, completed, bookmarks, theme, mobile toggle */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Streak pill */}
          <div
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20 shadow-xs"
            title="Current Practice Streak"
          >
            <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500 animate-pulse" />
            <span className="font-mono font-semibold">{progress?.streakDays || 1}d</span>
          </div>

          {/* Completed count pill */}
          <Link
            href="/progress"
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 transition-colors shadow-xs"
            title="Completed Challenges"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            <span className="font-mono font-semibold">{completedCount} Passed</span>
          </Link>

          {/* Bookmarks link */}
          <Link
            href="/library?filter=bookmarked"
            className="p-2 rounded-lg text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors relative"
            title="Bookmarked Challenges"
          >
            <Bookmark className="w-4 h-4" />
            {(progress?.bookmarkedScenarioIds?.length || 0) > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-blue-500 ring-2 ring-white dark:ring-zinc-900" />
            )}
          </Link>

          {/* Theme Toggle */}
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2 rounded-lg text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-zinc-600" />}
          </button>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors xl:hidden"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-t border-zinc-200 dark:border-zinc-800 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-2xl px-4 py-4 space-y-1 shadow-lg animate-in slide-in-from-top duration-200">
          <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 dark:text-zinc-500 px-3 pb-1">
            Navigation Menu
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === '/'
                ? safePathname === '/'
                : safePathname === item.href || (item.href !== '/' && !item.href.includes('?') && safePathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`px-3 py-2.5 rounded-xl text-sm font-medium flex items-center justify-between transition-colors ${
                  isActive
                    ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 font-semibold border border-blue-500/20'
                    : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800/60'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-zinc-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-mono font-semibold uppercase tracking-wider bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}
