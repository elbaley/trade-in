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
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useTranslation } from "react-i18next";
//@ts-expect-error: i18n is not a module
import tF from "../../i18n.js";
import { toast } from "sonner";
import { Label } from "../ui/label.js";

export type ModelRow = {
  id: number;
  name: string;
  companyId: number;
  maxTradeValue: number;
  imageUrl: string | null;
};

export function ModelsTable({ data }: { data: ModelRow[] }) {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  const [selectedModel, setSelectedModel] = useState<ModelRow | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [modelName, setModelName] = useState("");
  const [modelCompanyId, setModelCompanyId] = useState("");
  const [maxTradeValue, setMaxTradeValue] = useState("");

  const createMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/models`, {
        method: "POST",
        body: JSON.stringify({
          name: modelName,
          companyId: Number(modelCompanyId),
          maxTradeValue: Number(maxTradeValue),
        }),
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      return response.json();
    },
    onSuccess: () => {
      toast.success("Model created successfully");
      queryClient.invalidateQueries({ queryKey: ["modelsList"] });
      setIsSheetOpen(false);
      setSelectedModel(null);
      setModelName("");
      setModelCompanyId("");
      setMaxTradeValue("");
    },
    onError: () => toast.error("Failed to create model"),
  });

  const updateMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/models/${selectedModel?.id}`,
        {
          method: "PUT",
          body: JSON.stringify({
            name: modelName,
            companyId: Number(modelCompanyId),
            maxTradeValue: Number(maxTradeValue),
          }),
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        },
      );
      return response.json();
    },
    onSuccess: () => {
      toast.success("Model updated successfully");
      queryClient.invalidateQueries({ queryKey: ["modelsList"] });
      setIsSheetOpen(false);
      setSelectedModel(null);
      setModelName("");
      setModelCompanyId("");
      setMaxTradeValue("");
    },
    onError: () => toast.error("Failed to update model"),
  });

  const deleteMutation = useMutation({
    mutationFn: async (modelId: number) => {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/models/${modelId}`,
        { method: "DELETE", credentials: "include" },
      );
      return response.json();
    },
    onSuccess: () => {
      toast.success("Model deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["modelsList"] });
    },
    onError: () => toast.error("Failed to delete model"),
  });

  const columns: ColumnDef<ModelRow>[] = [
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
      accessorKey: "maxTradeValue",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          {tF.t("maxTradeValue")}
          <ArrowUpDown />
        </Button>
      ),
      cell: ({ row }) => (
        <div>
          {new Intl.NumberFormat("tr-TR", {
            style: "currency",
            currency: "TRY",
          }).format(row.getValue("maxTradeValue"))}
        </div>
      ),
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const model = row.original;
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
                  setSelectedModel(model);
                  setModelName(model.name);
                  setModelCompanyId(model.companyId.toString());
                  setMaxTradeValue(model.maxTradeValue.toString());
                  setIsSheetOpen(true);
                }}
              >
                {tF.t("Edit")}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  if (confirm("Are you sure you want to delete this model?")) {
                    deleteMutation.mutate(model.id);
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
      <div className="flex items-center py-4 flex-wrap gap-y-2">
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
              setModelName("");
              setModelCompanyId("");
              setMaxTradeValue("");
              setSelectedModel(null);
              setIsSheetOpen(true);
            }}
            className="ml-auto"
          >
            {t("New Model")} <LucidePlus />
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
            {selectedModel ? t("Edit Model") : t("New Model")}
          </h2>
          <Label>{t("Model Name")}</Label>
          <Input
            value={modelName}
            onChange={(e) => setModelName(e.target.value)}
            placeholder={t("Model Name") as string}
            className="mb-2"
          />

          <Label>{t("Company Id")}</Label>
          <Input
            value={modelCompanyId}
            onChange={(e) => setModelCompanyId(e.target.value)}
            placeholder={t("Company Id") as string}
            className="mb-2"
          />
          <Label>{t("Max Trade Value")}</Label>
          <Input
            value={maxTradeValue}
            onChange={(e) => setMaxTradeValue(e.target.value)}
            placeholder={t("Max Trade Value") as string}
            className="mb-4"
          />
          <Button
            onClick={() => {
              if (selectedModel) {
                updateMutation.mutate();
              } else {
                createMutation.mutate();
              }
            }}
          >
            {selectedModel ? t("Update") : t("Create")}
          </Button>
        </SheetContent>
      </Sheet>
    </div>
  );
}
