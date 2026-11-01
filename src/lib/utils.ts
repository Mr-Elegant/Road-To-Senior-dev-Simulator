import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  if (mins === 0) return `${secs}s`;
  return `${mins}m ${secs < 10 ? '0' : ''}${secs}s`;
}

export function getDifficultyColor(difficulty?: string | null): { bg: string; text: string; border: string } {
  switch ((difficulty || '').toLowerCase()) {
    case 'mid-level':
      return {
        bg: 'bg-emerald-500/10 dark:bg-emerald-500/20',
        text: 'text-emerald-700 dark:text-emerald-300',
        border: 'border-emerald-500/30',
      };
    case 'senior':
      return {
        bg: 'bg-blue-500/10 dark:bg-blue-500/20',
        text: 'text-blue-700 dark:text-blue-300',
        border: 'border-blue-500/30',
      };
    case 'staff/principal':
    case 'staff':
      return {
        bg: 'bg-purple-500/10 dark:bg-purple-500/20',
        text: 'text-purple-700 dark:text-purple-300',
        border: 'border-purple-500/30',
      };
    default:
      return {
        bg: 'bg-zinc-500/10 dark:bg-zinc-500/20',
        text: 'text-zinc-700 dark:text-zinc-300',
        border: 'border-zinc-500/30',
      };
  }
}

export function getTypeBadge(type?: string | null): { label: string; color: string } {
  const safeType = type || 'coding';
  switch (safeType) {
    case 'debugging':
      return { label: 'Debugging', color: 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30' };
    case 'incident':
      return { label: 'Production Incident', color: 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30' };
    case 'coding':
      return { label: 'Coding Challenge', color: 'bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 border-cyan-500/30' };
    case 'code_review':
      return { label: 'Code Review PR', color: 'bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border-indigo-500/30' };
    case 'system_design':
      return { label: 'System Design', color: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30' };
    case 'senior_interview':
      return { label: 'Senior Interview', color: 'bg-fuchsia-500/15 text-fuchsia-600 dark:text-fuchsia-400 border-fuchsia-500/30' };
    default:
      return { label: safeType, color: 'bg-zinc-500/15 text-zinc-600 dark:text-zinc-400 border-zinc-500/30' };
  }
}

