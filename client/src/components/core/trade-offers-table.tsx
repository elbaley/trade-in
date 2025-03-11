import * as React from "react";
import { useState } from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useTranslation } from "react-i18next";
//@ts-expect-error: i18n is not a module
import tF from "../../i18n.js";

export type TradeOfferRow = {
  id: number;
  modelId: number;
  modelName: string;
  selections: string;
  offerPrice: number;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  phoneNumber: string | null;
  status: "draft" | "pending" | "accepted" | "rejected" | "done";
  createdAt: string;
};

export function TradeOffersTable({ data }: { data: TradeOfferRow[] }) {
  const { t } = useTranslation();

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  const columns: ColumnDef<TradeOfferRow>[] = [
    {
      accessorKey: "id",
      header: () => <div className="text-left">ID</div>,
      cell: ({ row }) => (
        <div className="text-left font-medium">{row.getValue("id")}</div>
      ),
    },
    {
      accessorKey: "modelName",
      header: () => <div className="text-left">{tF.t("modelName")}</div>,
      cell: ({ row }) => (
        <div className="text-left">{row.getValue("modelName")}</div>
      ),
    },
    {
      accessorKey: "offerPrice",
      header: () => <div className="text-right">{tF.t("offerPrice")}</div>,
      cell: ({ row }) => (
        <div className="text-right">
          {new Intl.NumberFormat("tr-TR", {
            style: "currency",
            currency: "TRY",
          }).format(row.getValue("offerPrice"))}
        </div>
      ),
    },
    {
      accessorKey: "firstName",
      header: () => <div className="text-left">{tF.t("firstName")}</div>,
      cell: ({ row }) => (
        <div className="text-left">{row.getValue("firstName")}</div>
      ),
    },
    {
      accessorKey: "lastName",
      header: () => <div className="text-left">{tF.t("lastName")}</div>,
      cell: ({ row }) => (
        <div className="text-left">{row.getValue("lastName")}</div>
      ),
    },
    {
      accessorKey: "email",
      header: () => <div className="text-left">{tF.t("email")}</div>,
      cell: ({ row }) => (
        <div className="text-left">{row.getValue("email")}</div>
      ),
    },
    {
      accessorKey: "phoneNumber",
      header: () => <div className="text-left">{tF.t("phoneNumber")}</div>,
      cell: ({ row }) => (
        <div className="text-left">{row.getValue("phoneNumber")}</div>
      ),
    },
    {
      accessorKey: "status",
      header: () => <div className="text-left">{tF.t("status")}</div>,
      cell: ({ row }) => {
        const status = row.getValue("status");
        return (
          <div className="text-left">{tF.t(`tradeOfferStatus.${status}`)}</div>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: () => <div className="text-left">{tF.t("createdAt")}</div>,
      cell: ({ row }) => (
        <div className="text-left">
          {new Date(row.getValue("createdAt")).toLocaleString()}
        </div>
      ),
    },
  ];

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    initialState: { pagination: { pageSize: 10 } },
    state: { sorting, columnFilters, columnVisibility, rowSelection },
  });

  return (
    <div className="w-full">
      <div className="flex items-center py-4 flex-wrap gap-y-2">
        <Input
          placeholder={t("Filter name")}
          value={
            (table.getColumn("firstName")?.getFilterValue() as string) ?? ""
          }
          onChange={(event) =>
            table.getColumn("firstName")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <div className="ml-auto">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                {t("Columns")} <ChevronDown />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {t(column.id)}
                  </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={table.getAllColumns().length}
                  className="h-24 text-center"
                >
                  {t("No results")}.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            {t("Previous")}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            {t("Next")}
          </Button>
        </div>
      </div>
    </div>
  );
}
