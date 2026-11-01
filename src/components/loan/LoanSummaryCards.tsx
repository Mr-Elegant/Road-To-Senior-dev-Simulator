'use client';

import React from 'react';
import { useAppSelector } from '@/lib/redux/store';
import { selectDashboardStats, selectDashboardStatus } from '@/lib/redux/selectors';
import { FileText, Clock, CheckCircle2, XCircle, DollarSign, TrendingUp } from 'lucide-react';

function formatCurrency(amount: number): string {
  if (amount >= 10000000) {
    return `₹${(amount / 10000000).toFixed(2)} Cr`;
  }
  if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(1)} L`;
  }
  return `$${amount.toLocaleString()}`;
}

export function LoanSummaryCards() {
  const stats = useAppSelector(selectDashboardStats);
  const status = useAppSelector(selectDashboardStatus);
  const isLoading = status === 'loading' && stats.totalApplications === 0;

  const cards = [
    {
      title: 'Total Applications',
      value: stats.totalApplications.toLocaleString(),
      subtext: `${formatCurrency(stats.totalLoanAmount)} Total Volume`,
      icon: FileText,
      color: 'blue',
      borderColor: 'border-blue-500/20',
      bgColor: 'bg-blue-500/5',
      iconColor: 'text-blue-400',
    },
    {
      title: 'Pending Decisions',
      value: (stats.pendingApplications + stats.underReviewApplications).toLocaleString(),
      subtext: `${formatCurrency(stats.pendingLoanAmount)} Under Review`,
      icon: Clock,
      color: 'amber',
      borderColor: 'border-amber-500/20',
      bgColor: 'bg-amber-500/5',
      iconColor: 'text-amber-400',
    },
    {
      title: 'Approved Loans',
      value: stats.approvedApplications.toLocaleString(),
      subtext: `${formatCurrency(stats.approvedLoanAmount)} Funded`,
      icon: CheckCircle2,
      color: 'emerald',
      borderColor: 'border-emerald-500/20',
      bgColor: 'bg-emerald-500/5',
      iconColor: 'text-emerald-400',
    },
    {
      title: 'Rejected Applications',
      value: stats.rejectedApplications.toLocaleString(),
      subtext: `${stats.totalApplications > 0 ? ((stats.rejectedApplications / stats.totalApplications) * 100).toFixed(1) : 0}% Rejection Rate`,
      icon: XCircle,
      color: 'red',
      borderColor: 'border-red-500/20',
      bgColor: 'bg-red-500/5',
      iconColor: 'text-red-400',
    },
    {
      title: 'Approval Rate',
      value: `${stats.approvalRate}%`,
      subtext: `Avg Credit Score: ${stats.avgCreditScore}`,
      icon: TrendingUp,
      color: 'purple',
      borderColor: 'border-purple-500/20',
      bgColor: 'bg-purple-500/5',
      iconColor: 'text-purple-400',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {cards.map((card, idx) => {
        const IconComponent = card.icon;

        if (isLoading) {
          return (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800 animate-pulse flex flex-col justify-between h-32"
            >
              <div className="flex justify-between items-start">
                <div className="h-4 bg-zinc-800 rounded w-24"></div>
                <div className="w-8 h-8 rounded-lg bg-zinc-800"></div>
              </div>
              <div>
                <div className="h-7 bg-zinc-800 rounded w-16 mb-2"></div>
                <div className="h-3 bg-zinc-800 rounded w-28"></div>
              </div>
            </div>
          );
        }

        return (
          <div
            key={idx}
            className={`p-5 rounded-2xl border ${card.borderColor} ${card.bgColor} backdrop-blur-sm transition-all hover:border-opacity-40 flex flex-col justify-between`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-zinc-400 tracking-wider uppercase">
                {card.title}
              </span>
              <div className={`p-2 rounded-xl bg-zinc-900/80 border border-zinc-800 ${card.iconColor}`}>
                <IconComponent className="w-4 h-4" />
              </div>
            </div>

            <div>
              <div className="text-2xl font-black text-white tracking-tight">
                {card.value}
              </div>
              <div className="text-xs text-zinc-400 mt-1 flex items-center gap-1">
                <span>{card.subtext}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

