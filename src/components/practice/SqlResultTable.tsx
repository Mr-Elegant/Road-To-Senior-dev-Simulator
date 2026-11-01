'use client';

import React from 'react';
import { Table } from 'lucide-react';

interface SqlResultTableProps {
  data: Record<string, any>[];
  title?: string;
}

export function SqlResultTable({ data, title = 'Query Result Set' }: SqlResultTableProps) {
  if (!data || data.length === 0) {
    return (
      <div className="p-3 rounded-lg border border-zinc-800 bg-zinc-950/80 text-zinc-500 font-mono text-[11px] italic">
        (Empty result set: 0 rows returned)
      </div>
    );
  }

  const columns = Object.keys(data[0] || {});

  return (
    <div className="space-y-1.5 font-mono text-[11px]">
      <div className="flex items-center justify-between text-zinc-400 font-sans text-xs font-semibold">
        <span className="flex items-center gap-1.5">
          <Table className="w-3.5 h-3.5 text-blue-400" />
          <span>{title} ({data.length} row{data.length > 1 ? 's' : ''})</span>
        </span>
      </div>

      <div className="border border-zinc-800 rounded-lg overflow-x-auto bg-black/60 max-h-48">
        <table className="w-full text-left">
          <thead className="bg-zinc-900 border-b border-zinc-800 text-zinc-300">
            <tr>
              {columns.map((col) => (
                <th key={col} className="py-1.5 px-3 font-bold text-[10px] uppercase tracking-wider">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-900 text-zinc-200">
            {data.map((row, idx) => (
              <tr key={idx} className="hover:bg-zinc-900/40">
                {columns.map((col) => (
                  <td key={col} className="py-1 px-3 whitespace-nowrap text-zinc-300">
                    {typeof row[col] === 'object' && row[col] !== null
                      ? JSON.stringify(row[col])
                      : String(row[col] ?? 'NULL')}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

