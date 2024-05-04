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
    Column,
    TableState,
    InitialTableState,
    TableOptions,
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

import React, { CSSProperties } from "react";
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
import { ColumnVisibiltyCheckbox } from "./TableColumnVisibiltyCheckbox";

declare module "@tanstack/react-table" {
    //allows us to define custom properties for our columns
    // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
    interface ColumnMeta<TData extends RowData, TValue> {
        filterVariant?: FilterVariantType;
    }
}
// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-constraint
interface DataTableProps<TData extends unknown, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    columnOrder?: string[];
    onColumnOrderChange?: React.Dispatch<React.SetStateAction<string[]>>;
    columnFilters?: ColumnFiltersState;
    columnPinning?: {
        left?: string[];
        right?: string[];
    };
    pageSizeChangingEnabled?: boolean;
    pagination: PaginationState;
    onPaginationChange?: React.Dispatch<React.SetStateAction<PaginationState>>;
    // onColumnFiltersChange?: React.Dispatch<
    //     React.SetStateAction<ColumnFiltersState>
    // >;
}

// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-constraint
export function DataTable<TData extends unknown, TValue>({
    columns,
    data,
    columnOrder,
    onColumnOrderChange,
    columnFilters,
    pagination,
    onPaginationChange,
    columnPinning = {},
    pageSizeChangingEnabled = true,
}: DataTableProps<TData, TValue>) {
    const [columnVisibility, setColumnVisibility] = React.useState<
        Record<string, boolean>
    >({});

    const state: Partial<TableState> = {
        columnVisibility,
        columnOrder,
    };
    const initialState: InitialTableState = {
        columnFilters,
        columnPinning,
    };
    const tableOptions: TableOptions<TData> = {
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFacetedRowModel: getFacetedRowModel(),
        getFacetedUniqueValues: getFacetedUniqueValues(),
        getPaginationRowModel: getPaginationRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onColumnOrderChange,
    };
    if (typeof onPaginationChange === "undefined") {
        initialState.pagination = pagination;
    } else {
        state.pagination = pagination;
        tableOptions.onPaginationChange = onPaginationChange;
    }

    const table = useReactTable({ ...tableOptions, state, initialState });
    const checkboxVisibility = Object.fromEntries(
        table
            .getAllLeafColumns()
            .map((column) => [column.id, column.getIsVisible()]),
    );
    return (
        <>
            <ColumnVisibiltyCheckbox
                columnState={checkboxVisibility}
                onChange={(colName, nextState) => {
                    if (typeof nextState !== "boolean") return;
                    setColumnVisibility((prev) => ({
                        ...prev,
                        [colName]: nextState,
                    }));
                }}
            />
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
                                            style={getCommonPinningStyles<TData>(
                                                header.column,
                                            )}
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
                                        <TableCell
                                            key={cell.id}
                                            style={getCommonPinningStyles(
                                                cell.column,
                                            )}
                                        >
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
            <TablePaginationNav
                table={table}
                enablePageSizeChange={pageSizeChangingEnabled}
            />
        </>
    );
}

interface TablePaginationNavProps<TData> {
    table: TableT<TData>;
    enablePageSizeChange: boolean;
}
function TablePaginationNav<TData>({
    table,
    enablePageSizeChange,
}: TablePaginationNavProps<TData>) {
    const pageSizeOptions = [5, 10, 20, 50];
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
                        disabled={!enablePageSizeChange}
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

//These are the important styles to make sticky column pinning work!
//Apply styles like this using your CSS strategy of choice with this kind of logic to head cells, data cells, footer cells, etc.
//View the index.css file for more needed styles such as border-collapse: separate
// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-constraint
function getCommonPinningStyles<TData extends unknown>(
    column: Column<TData>,
): CSSProperties {
    const isPinned = column.getIsPinned();
    const isLastLeftPinnedColumn =
        isPinned === "left" && column.getIsLastColumn("left");
    const isFirstRightPinnedColumn =
        isPinned === "right" && column.getIsFirstColumn("right");

    return {
        boxShadow: isLastLeftPinnedColumn
            ? "-4px 0 4px -4px gray inset"
            : isFirstRightPinnedColumn
              ? "4px 0 4px -4px gray inset"
              : undefined,
        left: isPinned === "left" ? `${column.getStart("left")}px` : undefined,
        right:
            isPinned === "right" ? `${column.getAfter("right")}px` : undefined,
        opacity: isPinned ? 0.9 : 1,
        position: isPinned ? "sticky" : "relative",
        width: column.getSize(),
        zIndex: isPinned ? 1 : 0,
        background: "hsl(var(--background))",
    };
}
