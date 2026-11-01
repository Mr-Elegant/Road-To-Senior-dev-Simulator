'use client';

import React from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/redux/store';
import { selectPaginationSummary } from '@/lib/redux/selectors';
import { setPage, fetchApplications } from '@/lib/redux/slices/applicationsSlice';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

export function LoanPagination() {
  const dispatch = useAppDispatch();
  const summary = useAppSelector(selectPaginationSummary);

  const { currentPage, totalPages, totalCount, startRecord, endRecord, hasNext, hasPrev } = summary;

  if (totalCount === 0) return null;

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages && newPage !== currentPage) {
      dispatch(setPage(newPage));
      dispatch(fetchApplications());
    }
  };

  // Generate page numbers window (e.g. 1 2 3 ... 10)
  const renderPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push('...');

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) pages.push('...');
      pages.push(totalPages);
    }

    return pages.map((p, idx) => {
      if (p === '...') {
        return (
          <span key={`dots-${idx}`} className="px-2 py-1 text-xs text-zinc-500">
            ...
          </span>
        );
      }

      const pageNum = p as number;
      const isCurrent = pageNum === currentPage;

      return (
        <button
          key={pageNum}
          onClick={() => handlePageChange(pageNum)}
          className={`min-w-[32px] h-8 px-2.5 rounded-lg text-xs font-semibold transition-all ${
            isCurrent
              ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
              : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800'
          }`}
        >
          {pageNum}
        </button>
      );
    });
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-2 py-3 text-xs text-zinc-400">
      <div>
        Showing <span className="font-semibold text-zinc-200">{startRecord}</span> to{' '}
        <span className="font-semibold text-zinc-200">{endRecord}</span> of{' '}
        <span className="font-semibold text-zinc-200">{totalCount}</span> applications
      </div>

      <div className="flex items-center gap-1">
        {/* First page */}
        <button
          disabled={!hasPrev}
          onClick={() => handlePageChange(1)}
          className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          title="First Page"
        >
          <ChevronsLeft className="w-4 h-4" />
        </button>

        {/* Previous page */}
        <button
          disabled={!hasPrev}
          onClick={() => handlePageChange(currentPage - 1)}
          className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          title="Previous Page"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Page numbers */}
        <div className="flex items-center gap-1 mx-1">{renderPageNumbers()}</div>

        {/* Next page */}
        <button
          disabled={!hasNext}
          onClick={() => handlePageChange(currentPage + 1)}
          className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          title="Next Page"
        >
          <ChevronRight className="w-4 h-4" />
        </button>

        {/* Last page */}
        <button
          disabled={!hasNext}
          onClick={() => handlePageChange(totalPages)}
          className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          title="Last Page"
        >
          <ChevronsRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

