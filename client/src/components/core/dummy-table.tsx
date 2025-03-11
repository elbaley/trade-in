import * as React from "react";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
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
import {
  ArrowUpDown,
  ChevronDown,
  LucidePlus,
  MoreHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
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
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { useTranslation } from "react-i18next";
//@ts-expect-error: i18n is not a module
import tF from "../../i18n.js";
import { toast } from "sonner";

export type CompanyRow = {
  id: number;
  name: string;
  logoUrl: string | null;
};

export function CompaniesTable({ data }: { data: CompanyRow[] }) {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  // React Table state'leri
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  // Şirket oluşturma / düzenleme için sheet state'leri
  const [selectedCompany, setSelectedCompany] = useState<CompanyRow | null>(
    null,
  );
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [companyName, setCompanyName] = useState("");

  // Yeni şirket oluşturma mutasyonu
  const createMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/companies`,
        {
          method: "POST",
          body: JSON.stringify({ name: companyName }),
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        },
      );
      return response.json();
    },
    onSuccess: () => {
      toast.success("Company created successfully");
      queryClient.invalidateQueries({ queryKey: ["companiesList"] });
      setIsSheetOpen(false);
      setSelectedCompany(null);
      setCompanyName("");
    },
    onError: () => toast.error("Failed to create company"),
  });

  // Şirket güncelleme mutasyonu
  const updateMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/companies/${selectedCompany?.id}`,
        {
          method: "PUT",
          body: JSON.stringify({ name: companyName }),
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        },
      );
      return response.json();
    },
    onSuccess: () => {
      toast.success("Company updated successfully");
      queryClient.invalidateQueries({ queryKey: ["companiesList"] });
      setIsSheetOpen(false);
      setSelectedCompany(null);
      setCompanyName("");
    },
    onError: () => toast.error("Failed to update company"),
  });

  // Şirket silme mutasyonu
  const deleteMutation = useMutation({
    mutationFn: async (companyId: number) => {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/companies/${companyId}`,
        { method: "DELETE", credentials: "include" },
      );
      return response.json();
    },
    onSuccess: () => {
      toast.success("Company deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["companiesList"] });
    },
    onError: () => toast.error("Failed to delete company"),
  });

  // Tablonun sütunları
  const columns: ColumnDef<CompanyRow>[] = [
    {
      accessorKey: "id",
      header: () => <div className="text-left">{tF.t("id")}</div>,
      cell: ({ row }) => (
        <div className="text-left font-medium">{row.getValue("id")}</div>
      ),
    },
    {
      accessorKey: "name",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          {tF.t("name")}
          <ArrowUpDown />
        </Button>
      ),
      cell: ({ row }) => <div>{row.getValue("name")}</div>,
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const company = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>{tF.t("Actions")}</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => {
                  setSelectedCompany(company);
                  setCompanyName(company.name);
                  setIsSheetOpen(true);
                }}
              >
                {tF.t("Edit")}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  if (
                    confirm("Are you sure you want to delete this company?")
                  ) {
                    deleteMutation.mutate(company.id);
                  }
                }}
              >
                {tF.t("Delete")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  // React Table yapılandırması
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
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <Input
          placeholder={t("Filter name")}
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />

        <div className="ml-auto flex gap-2">
          <Button
            onClick={() => {
              setCompanyName("");
              setSelectedCompany(null);
              setIsSheetOpen(true);
            }}
            className="ml-auto"
          >
            {t("New Company")} <LucidePlus />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
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
                  colSpan={columns.length}
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
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="px-2 pt-4">
          <h2 className="font-medium text-2xl">
            {selectedCompany ? t("Edit Company") : t("New Company")}
          </h2>
          <Input
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            placeholder={t("Company Name") as string}
          />
          <Button
            onClick={() => {
              if (selectedCompany) {
                updateMutation.mutate();
              } else {
                createMutation.mutate();
              }
            }}
          >
            {selectedCompany ? t("Update") : t("Create")}
          </Button>
        </SheetContent>
      </Sheet>
    </div>
  );
}
