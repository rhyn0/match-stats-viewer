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
} from "@tanstack/react-table";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import React from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { Filter } from "./Filter";
import { FilterVariantType } from "@/types";

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
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFacetedRowModel: getFacetedRowModel(),
        getFacetedUniqueValues: getFacetedUniqueValues(),
        state: {
            columnOrder,
        },
        onColumnOrderChange,
        initialState: {
            columnFilters, // will i be able to directly tie in a filter change here?
        },
    });

    return (
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
                                                        header.column.columnDef
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
                                No results.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
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
