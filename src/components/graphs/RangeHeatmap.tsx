"use client";
import { InteractionDataTODO } from "@/types";
import * as d3 from "d3";
import React from "react";
import { Tooltip } from "./Tooltip";

type DataT = { value: number } & Record<string, string>;
export interface RangeHeatMapProps<TData extends Record<string, string>> {
    columnKey: keyof TData;
    rowKey: keyof TData;
    data: DataT[];
    height: number;
    width: number;
    margin?: { top: number; right: number; bottom: number; left: number };
}
export function RangeHeatMap<TData extends Record<string, string>>({
    columnKey,
    rowKey,
    data,
    height,
    width,
    margin = { top: 80, right: 25, bottom: 30, left: 40 },
}: RangeHeatMapProps<TData>) {
    const adjustedWidth = width - margin.left - margin.right;
    const adjustedHeight = height - margin.top - margin.right;
    const [interactionData, setInteractionData] = React.useState<
        InteractionDataTODO | undefined
    >(undefined);
    const columnVars = React.useMemo(
        () => [...new Set(data.map((d) => d[columnKey]))],
        [data, columnKey],
    );
    const rowVars = React.useMemo(
        () => [...new Set(data.map((d) => d[rowKey]))],
        [data, rowKey],
    );
    const xScale = React.useMemo(
        () =>
            d3
                .scaleBand()
                .range([0, adjustedWidth])
                .domain(columnVars)
                .padding(0.05),
        [columnVars, adjustedWidth],
    );
    const yScale = React.useMemo(
        () =>
            d3
                .scaleBand()
                .range([adjustedHeight, 0])
                .domain(rowVars as string[])
                .padding(0.05),
        [rowVars, adjustedHeight],
    );

    const [min, max] = d3.extent(data.map((d) => d.value));
    if (!min || !max) {
        console.error("No data values present");
        return null;
    }
    // Color scale
    const colorScale = d3
        .scaleSequential()
        .interpolator(d3.interpolateInferno)
        .domain([min, max]);

    return (
        <div className="relative">
            <svg
                className="border-2 border-yellow-500 text-white"
                height={height}
                width={width}
            >
                <g
                    height={adjustedHeight}
                    width={adjustedWidth}
                    transform={`translate(${[margin.left, margin.top].join(",")})`}
                >
                    {buildRects(
                        data,
                        columnKey,
                        rowKey,
                        xScale,
                        yScale,
                        colorScale,
                        setInteractionData,
                    )}
                    {buildXLabels(columnVars, xScale, adjustedHeight)}
                    {buildYLabels(rowVars, yScale)}
                </g>
            </svg>
            <Tooltip
                interactionData={interactionData}
                width={width}
                height={height}
            />
        </div>
    );
}

function buildRects(
    data: DataT[],
    columnKey: string,
    rowKey: string,
    xScale: d3.ScaleBand<string>,
    yScale: d3.ScaleBand<string>,
    colorScale: d3.ScaleSequential<string, never>,
    setInteractionData: React.Dispatch<
        React.SetStateAction<InteractionDataTODO | undefined>
    >,
) {
    return data.map((d, idx) => {
        const xPos = xScale(d[columnKey]);
        const yPos = yScale(d[rowKey]);
        return (
            <rect
                key={idx}
                r={4}
                x={xPos}
                y={yPos}
                width={xScale.bandwidth()}
                height={yScale.bandwidth()}
                opacity={1}
                fill={colorScale(d.value)}
                rx={5}
                stroke={"white"}
                onMouseMove={() =>
                    setInteractionData({
                        xPos,
                        yPos,
                        ...d,
                    })
                }
                onMouseLeave={() => setInteractionData(undefined)}
            />
        );
    });
}

function buildXLabels(
    xGroups: string[],
    xScale: d3.ScaleBand<string>,
    height: number,
) {
    return xGroups.map((name, idx) => (
        <text
            key={idx}
            x={(xScale(name) ?? 0) + xScale.bandwidth() / 2}
            y={height + 10}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize="10"
            className="fill-black dark:fill-slate-300"
        >
            {name}
        </text>
    ));
}

function buildYLabels(yGroups: string[], yScale: d3.ScaleBand<string>) {
    return yGroups.map((name, idx) => (
        <text
            key={idx}
            x={-5}
            y={(yScale(name) ?? 0) + yScale.bandwidth() / 2}
            textAnchor="end"
            dominantBaseline="middle"
            fontSize="10"
            className="fill-black dark:fill-slate-300"
        >
            {name}
        </text>
    ));
}
