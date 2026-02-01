import React, { useMemo, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  type ColumnDef,
  type SortingState,
  type ColumnFiltersState,
} from "@tanstack/react-table";
import { severityColors, getNVDLink } from "../lib/catalog/utils";

export interface CVEEntry {
  id: string;
  severity: string;
  package: string;
  version: string;
  fixedIn?: string;
  description?: string;
  urls?: string[];
  imageSource?: string;
}

interface CVETableProps {
  data: CVEEntry[];
  loading?: boolean;
  notAvailable?: boolean;
  showImageSource?: boolean;
}

const SeverityBadge = ({ severity }: { severity: string }) => {
  const colorClass = severityColors[severity.toLowerCase()] || severityColors.unknown;
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${colorClass}`}>
      {severity}
    </span>
  );
};

const GitHubIcon = () => (
  <svg viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4">
    <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
  </svg>
);

export function CVETable({
  data,
  loading = false,
  notAvailable = false,
  showImageSource = false,
}: CVETableProps) {
  const [sorting, setSorting] = useState<SortingState>([
    { id: "severity", desc: false },
  ]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [pageSize, setPageSize] = useState(25);

  const columns = useMemo<ColumnDef<CVEEntry>[]>(() => {
    const cols: ColumnDef<CVEEntry>[] = [
      {
        accessorKey: "id",
        header: "CVE ID",
        cell: ({ getValue }) => {
          const id = getValue<string>();
          return (
            <a
              href={getNVDLink(id)}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-[#7EA8FF] hover:text-white hover:underline"
            >
              {id}
            </a>
          );
        },
        filterFn: "includesString",
      },
      {
        accessorKey: "severity",
        header: "Severity",
        cell: ({ getValue }) => <SeverityBadge severity={getValue<string>()} />,
        sortingFn: (a, b) => {
          const order = { critical: 0, high: 1, medium: 2, low: 3, unknown: 4 };
          const aVal = order[a.original.severity.toLowerCase() as keyof typeof order] ?? 5;
          const bVal = order[b.original.severity.toLowerCase() as keyof typeof order] ?? 5;
          return aVal - bVal;
        },
        filterFn: "includesString",
      },
      {
        accessorKey: "package",
        header: "Package",
        cell: ({ getValue }) => (
          <span className="font-mono text-[#9BA3B5]">{getValue<string>()}</span>
        ),
        filterFn: "includesString",
      },
      {
        accessorKey: "version",
        header: "Version",
        cell: ({ getValue }) => (
          <span className="font-mono text-[#9BA3B5]">{getValue<string>()}</span>
        ),
        filterFn: "includesString",
      },
      {
        accessorKey: "fixedIn",
        header: "Fixed In",
        cell: ({ getValue }) => {
          const val = getValue<string | undefined>();
          return val ? (
            <span className="font-mono text-green-400">{val}</span>
          ) : (
            <span className="text-[#5C677D]">—</span>
          );
        },
        filterFn: "includesString",
      },
    ];

    if (showImageSource) {
      cols.push({
        accessorKey: "imageSource",
        header: "Image",
        cell: ({ getValue }) => (
          <span className="font-mono text-xs text-[#5C677D] truncate max-w-[150px] block" title={getValue<string>()}>
            {getValue<string>()}
          </span>
        ),
        filterFn: "includesString",
      });
    }

    return cols;
  }, [showImageSource]);

  const table = useReactTable({
    data,
    columns,
    state: { sorting, columnFilters, pagination: { pageIndex: 0, pageSize } },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-2 border-[#0466C8]/40 border-t-[#0466C8] rounded-full animate-spin" />
        <span className="ml-3 text-sm text-[#9BA3B5]">Loading scan results...</span>
      </div>
    );
  }

  if (notAvailable) {
    return (
      <div className="rounded-xl border border-[#023052] bg-[#001233] p-6 text-center">
        <p className="text-sm text-[#5C677D]">Scans aren't available yet for this version.</p>
        {githubUrl && (
          <a
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 mt-3 text-xs text-[#7EA8FF] hover:text-white"
          >
            <GitHubIcon />
            <span>View on GitHub</span>
          </a>
        )}
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="rounded-xl border border-green-500/30 bg-green-500/10 p-6 text-center">
        <p className="text-sm text-green-400">🎉 No vulnerabilities found!</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Table info */}
      <div className="text-xs text-[#5C677D]">
        {table.getFilteredRowModel().rows.length} CVEs
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-[#023052]">
        <table className="w-full text-left text-sm">
          <thead className="bg-[#001233] text-xs uppercase text-[#5C677D] border-b border-[#023052]">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className="px-4 py-3">
                    <div className="space-y-1">
                      <button
                        type="button"
                        onClick={header.column.getToggleSortingHandler()}
                        className="flex items-center gap-1 hover:text-white transition"
                      >
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {{
                          asc: " ↑",
                          desc: " ↓",
                        }[header.column.getIsSorted() as string] ?? ""}
                      </button>
                      <input
                        type="text"
                        value={(header.column.getFilterValue() as string) ?? ""}
                        onChange={(e) => header.column.setFilterValue(e.target.value)}
                        placeholder="Filter..."
                        className="w-full px-2 py-1 text-xs rounded border border-[#023052] bg-[#00101F] text-white placeholder-[#5C677D] focus:border-[#0466C8] focus:outline-none"
                      />
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-[#023052]">
            {table.getRowModel().rows.map((row, idx) => (
              <tr
                key={row.id}
                className={`${idx % 2 === 0 ? "bg-[#00101F]" : "bg-[#001233]"} hover:bg-[#001a35] transition`}
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-4 py-2.5">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between gap-4 text-xs text-[#5C677D]">
        <div className="flex items-center gap-2">
          <span>Show</span>
          <select
            value={pageSize === data.length ? -1 : pageSize}
            onChange={(e) => {
              const val = Number(e.target.value);
              setPageSize(val === -1 ? data.length : val);
            }}
            className="px-2 py-1 rounded border border-[#023052] bg-[#001233] text-white focus:border-[#0466C8] focus:outline-none"
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={-1}>All</option>
          </select>
          <span>entries</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="px-2 py-1 rounded border border-[#023052] bg-[#001233] text-[#7EA8FF] disabled:opacity-40 disabled:cursor-not-allowed hover:border-[#0466C8] transition"
          >
            Prev
          </button>
          <span>
            Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
          </span>
          <button
            type="button"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="px-2 py-1 rounded border border-[#023052] bg-[#001233] text-[#7EA8FF] disabled:opacity-40 disabled:cursor-not-allowed hover:border-[#0466C8] transition"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default CVETable;
