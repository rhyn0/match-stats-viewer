"use client";

import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
    ColumnFiltersState,
    getFilteredRowModel,
    SortDirection,
    getSortedRowModel,
    RowData,
    getFacetedRowModel,
    getFacetedUniqueValues,
    getPaginationRowModel,
    Table as TableT,
    PaginationState,
} from "@tanstack/react-table";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import React from "react";
import {
    ChevronDown,
    ChevronUp,
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Filter } from "./Filter";
import { FilterVariantType } from "@/types";
import { Button, ButtonProps } from "./ui/button";
import { Input } from "./ui/input";

declare module "@tanstack/react-table" {
    //allows us to define custom properties for our columns
    // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
    interface ColumnMeta<TData extends RowData, TValue> {
        filterVariant?: FilterVariantType;
    }
}

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    columnOrder?: string[];
    onColumnOrderChange?: React.Dispatch<React.SetStateAction<string[]>>;
    columnFilters?: ColumnFiltersState;
    // onColumnFiltersChange?: React.Dispatch<
    //     React.SetStateAction<ColumnFiltersState>
    // >;
}

export function DataTable<TData, TValue>({
    columns,
    data,
    columnOrder,
    onColumnOrderChange,
    columnFilters,
}: DataTableProps<TData, TValue>) {
    const [tablePagination, setTablePagination] =
        React.useState<PaginationState>({
            pageIndex: 0,
            pageSize: 10,
        });
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFacetedRowModel: getFacetedRowModel(),
        getFacetedUniqueValues: getFacetedUniqueValues(),
        getPaginationRowModel: getPaginationRowModel(),
        onPaginationChange: setTablePagination,
        state: {
            columnOrder,
            pagination: tablePagination,
        },
        onColumnOrderChange,
        initialState: {
            columnFilters, // will i be able to directly tie in a filter change here?
        },
    });
    return (
        <>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead
                                            key={header.id}
                                            colSpan={header.colSpan}
                                            className="border"
                                        >
                                            {header.isPlaceholder ? null : (
                                                <div className="flex flex-col space-y-2">
                                                    <div
                                                        className={cn({
                                                            "flex cursor-pointer select-none flex-row justify-evenly":
                                                                header.column.getCanSort(),
                                                        })}
                                                        onClick={header.column.getToggleSortingHandler()}
                                                    >
                                                        {flexRender(
                                                            header.column
                                                                .columnDef
                                                                .header,
                                                            header.getContext(),
                                                        )}
                                                        <SortIcon
                                                            sortState={header.column.getIsSorted()}
                                                        />
                                                    </div>
                                                    <Filter
                                                        column={header.column}
                                                    />
                                                </div>
                                            )}
                                        </TableHead>
                                    );
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={
                                        row.getIsSelected() && "selected"
                                    }
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
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <TablePaginationNav table={table} />
        </>
    );
}

interface TablePaginationNavProps<TData> {
    table: TableT<TData>;
}
function TablePaginationNav<TData>({ table }: TablePaginationNavProps<TData>) {
    const pageSizeOptions = [10, 20, 50];
    return (
        <div className="flex flex-col items-center justify-end space-x-2 py-4">
            <div className="flex flex-row">
                <PaginationButton
                    // go to first page
                    onClick={() => table.firstPage()}
                >
                    <ChevronsLeft />
                </PaginationButton>
                <PaginationButton
                    // go to previous page, can be disabled
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                >
                    <ChevronLeft />
                </PaginationButton>
                <PaginationButton
                    // go to next page, can be disabled
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                >
                    <ChevronRight />
                </PaginationButton>
                <PaginationButton
                    // go to last page
                    onClick={() => table.lastPage()}
                >
                    <ChevronsRight />
                </PaginationButton>
                <span className="flex items-center gap-1">
                    <div>Page</div>
                    <strong>
                        {table.getState().pagination.pageIndex + 1} of{" "}
                        {table.getPageCount().toLocaleString()}
                    </strong>
                </span>
            </div>
            <div className="flex flex-row">
                <span className="flex items-center gap-1">
                    Go to Page:
                    <Input
                        className="w-16 rounded border p-1"
                        type="number"
                        defaultValue={table.getState().pagination.pageIndex + 1}
                        onChange={(e) => {
                            const newPage = e.target.value
                                ? Number(e.target.value) - 1
                                : 0;
                            table.setPageIndex(newPage);
                        }}
                    />
                    <Select
                        onValueChange={(val) => table.setPageSize(Number(val))}
                        value={`${table.getState().pagination.pageSize}`}
                    >
                        <SelectTrigger className="max-w-fit rounded">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {pageSizeOptions.map((size) => (
                                <SelectItem
                                    value={`${size}`}
                                    key={size}
                                >
                                    Show {size.toLocaleString()}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </span>
            </div>
        </div>
    );
}

type PaginationButtonProps = Omit<ButtonProps, "variant" | "size">;

function PaginationButton({ children, ...props }: PaginationButtonProps) {
    return (
        <Button
            variant="outline"
            size="icon"
            {...props}
        >
            {children}
        </Button>
    );
}

function SortIcon({ sortState }: { sortState: false | SortDirection }) {
    if (!sortState) {
        return null;
    } else if (sortState === "asc") {
        return <ChevronUp />;
    } else {
        return <ChevronDown />;
    }
}
