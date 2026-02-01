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

export interface SBOMEntry {
  name: string;
  version: string;
  type: string;
  license?: string;
  imageSource?: string;
}

interface SBOMTableProps {
  data: SBOMEntry[];
  loading?: boolean;
  notAvailable?: boolean;
  showImageSource?: boolean;
}

export function SBOMTable({
  data,
  loading = false,
  notAvailable = false,
  showImageSource = false,
}: SBOMTableProps) {
  const [sorting, setSorting] = useState<SortingState>([{ id: "name", desc: false }]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [pageSize, setPageSize] = useState(25);

  const columns = useMemo<ColumnDef<SBOMEntry>[]>(() => {
    const cols: ColumnDef<SBOMEntry>[] = [
      {
        accessorKey: "name",
        header: "Package",
        cell: ({ getValue }) => <span className="font-mono text-white">{getValue<string>()}</span>,
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
        accessorKey: "type",
        header: "Type",
        cell: ({ getValue }) => {
          const type = getValue<string>();
          const typeColors: Record<string, string> = {
            deb: "bg-blue-500/20 text-blue-400 border-blue-500/40",
            rpm: "bg-orange-500/20 text-orange-400 border-orange-500/40",
            "go-module": "bg-cyan-500/20 text-cyan-400 border-cyan-500/40",
            npm: "bg-red-500/20 text-red-400 border-red-500/40",
            pip: "bg-yellow-500/20 text-yellow-400 border-yellow-500/40",
            apk: "bg-green-500/20 text-green-400 border-green-500/40",
          };
          const colorClass =
            typeColors[type.toLowerCase()] || "bg-gray-500/20 text-gray-400 border-gray-500/40";
          return (
            <span
              className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${colorClass}`}
            >
              {type}
            </span>
          );
        },
        filterFn: "includesString",
      },
      {
        accessorKey: "license",
        header: "License",
        cell: ({ getValue }) => {
          const val = getValue<string | undefined>();
          return val ? (
            <span className="text-[#9BA3B5] text-xs truncate max-w-[200px] block" title={val}>
              {val}
            </span>
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
          <span
            className="font-mono text-xs text-[#5C677D] truncate max-w-[150px] block"
            title={getValue<string>()}
          >
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
        <span className="ml-3 text-sm text-[#9BA3B5]">Loading SBOM data...</span>
      </div>
    );
  }

  if (notAvailable) {
    return (
      <div className="rounded-xl border border-[#023052] bg-[#001233] p-6 text-center">
        <p className="text-sm text-[#5C677D]">SBOM isn't available yet for this version.</p>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="rounded-xl border border-[#023052] bg-[#001233] p-6 text-center">
        <p className="text-sm text-[#5C677D]">No packages found in SBOM.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Row count */}
      <div className="text-xs text-[#5C677D]">
        {table.getFilteredRowModel().rows.length} packages
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

export default SBOMTable;
