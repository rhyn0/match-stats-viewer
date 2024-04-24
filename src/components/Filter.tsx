"use client";
import { Column, RowData } from "@tanstack/react-table";
import React from "react";
import { DebouncedInput } from "./debounceInput";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

export interface FilterProps<TData extends RowData> {
    column: Column<TData, unknown>;
}

interface SubFilterProps<TData extends RowData, FilterT>
    extends FilterProps<TData> {
    filterValue: FilterT | undefined;
}

export function Filter<TData extends RowData>({ column }: FilterProps<TData>) {
    const columnFilterValue = column.getFilterValue();
    const { filterVariant } = column.columnDef.meta ?? {};

    if (!column.getCanFilter()) {
        return null;
    }

    return filterVariant === "range" ? (
        <FilterRange<TData>
            column={column}
            filterValue={columnFilterValue as [number, number] | undefined}
        />
    ) : filterVariant === "select" ? (
        <FilterSelect
            column={column}
            filterValue={columnFilterValue?.toString()}
        />
    ) : (
        <FilterText
            column={column}
            filterValue={columnFilterValue as string | undefined}
        />
    );
}

function FilterRange<TData extends RowData>({
    column,
    filterValue,
}: SubFilterProps<TData, [number, number]>) {
    return (
        <div>
            <div className="mb-1 flex space-x-2">
                <DebouncedInput
                    type="number"
                    value={filterValue?.[0] ?? ""}
                    onChange={(value) =>
                        column.setFilterValue((old: [number, number]) => [
                            value,
                            old?.[1],
                        ])
                    }
                    placeholder={`Min`}
                    className="w-24 rounded border shadow"
                />
                <DebouncedInput
                    type="number"
                    value={filterValue?.[1] ?? ""}
                    onChange={(value) =>
                        column.setFilterValue((old: [number, number]) => [
                            old?.[0],
                            value,
                        ])
                    }
                    placeholder={`Max`}
                    className="w-24 rounded border shadow"
                />
            </div>
        </div>
    );
}

interface FilterSelectProps<TData extends RowData>
    extends SubFilterProps<TData, string> {
    placeholderText?: string;
}
/**
 * Requires columnFaceting and FactedUniqueValues to be enabled
 */
function FilterSelect<TData extends RowData>({
    column,
    filterValue,
    placeholderText = "Team Name",
}: FilterSelectProps<TData>) {
    const sortedUniqueValues = React.useMemo(
        () =>
            Array.from(column.getFacetedUniqueValues().keys())
                .sort()
                .slice(0, 5000),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [column.getFacetedUniqueValues()],
    );
    return (
        <Select
            onValueChange={(newVal) => column.setFilterValue(newVal)}
            defaultValue={filterValue}
        >
            <SelectTrigger className="w-[180px]">
                <SelectValue placeholder={placeholderText} />
            </SelectTrigger>
            <SelectContent>
                <SelectItem
                    // @ts-expect-error - we want to have an 'All' option, but empty string is disallowed
                    value={null}
                >
                    All
                </SelectItem>
                {sortedUniqueValues.map((filterOption) => (
                    <SelectItem
                        value={filterOption}
                        key={filterOption}
                    >
                        {filterOption}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}

function FilterText<TData extends RowData>({
    column,
    filterValue,
}: SubFilterProps<TData, string>) {
    return (
        <DebouncedInput
            className="w-36 rounded border shadow"
            onChange={(value) => column.setFilterValue(value)}
            placeholder={`Search...`}
            type="text"
            value={filterValue ?? ""}
        />
    );
}
