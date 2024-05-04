"use client";
import { InteractionData } from "@/types";
import * as d3 from "d3";
import React from "react";
import { Tooltip } from "./Tooltip";
import { ColorLegend } from "./ColorLegend";
import { DataT } from "@/types";

export interface RangeHeatMapProps {
    data: DataT[];
    height: number;
    width: number;
    title: string;
    description: string;
    margin?: { top: number; right: number; bottom: number; left: number };
    minMax?: [number, number];
}
export function RangeHeatMap({
    data,
    height,
    width,
    title,
    description,
    margin = { top: 80, right: 25, bottom: 80, left: 40 },
    minMax,
}: RangeHeatMapProps) {
    const adjustedWidth = width - margin.left - margin.right;
    const adjustedHeight = height - margin.top - margin.bottom;
    const [interactionData, setInteractionData] = React.useState<
        InteractionData | undefined
    >(undefined);
    const columnVars = React.useMemo(
        () => [...new Set(data.map((d) => d.colKey))],
        [data],
    );
    const rowVars = React.useMemo(
        () => [...new Set(data.map((d) => d.rowKey))],
        [data],
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

    const [min, max] = !minMax ? d3.extent(data.map((d) => d.value)) : minMax;
    if (typeof min === "undefined" || typeof max === "undefined") {
        console.error("No data values present");
        return null;
    }
    // Color scale
    const colorScale = d3
        .scaleSequential()
        .interpolator(d3.interpolateRdYlGn)
        .domain([min, max]);

    return (
        <div className="relative">
            <svg
                className=" text-white"
                height={height}
                width={width}
            >
                <g
                    height={adjustedHeight}
                    width={adjustedWidth}
                    transform={`translate(${[margin.left, margin.top].join(",")})`}
                >
                    <text
                        x="0"
                        y={-margin.top + 40}
                        textAnchor="left"
                        className="fill-black text-xl dark:fill-white"
                    >
                        {title}
                    </text>
                    <text
                        x="0"
                        y={-margin.top + 60}
                        textAnchor="left"
                        className="max-w-96 fill-gray-600 text-sm dark:fill-gray-300 "
                    >
                        {description}
                    </text>
                    <g>
                        {buildRects(
                            data,
                            xScale,
                            yScale,
                            colorScale,
                            setInteractionData,
                        )}
                    </g>
                    <g>{buildXLabels(columnVars, xScale, adjustedHeight)}</g>
                    <g>{buildYLabels(rowVars, yScale)}</g>
                </g>
            </svg>
            <Tooltip
                interactionData={interactionData}
                width={width}
                height={height}
            />
            <div className="flex w-full justify-center">
                <ColorLegend
                    width={adjustedWidth - 200}
                    height={100}
                    colorScale={colorScale}
                />
            </div>
        </div>
    );
}

function buildRects(
    data: DataT[],
    xScale: d3.ScaleBand<string>,
    yScale: d3.ScaleBand<string>,
    colorScale: d3.ScaleSequential<string, never>,
    setInteractionData: React.Dispatch<
        React.SetStateAction<InteractionData | undefined>
    >,
) {
    return data.map((d, idx) => {
        const xPos = xScale(d.colKey) as number;
        const yPos = yScale(d.rowKey) as number;
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
            className="w- text-wrap fill-black dark:fill-slate-300"
        >
            {name}
        </text>
    ));
}

function buildYLabels(yGroups: string[], yScale: d3.ScaleBand<string>) {
    const lineHeight = 1; //em
    const dyAdjust = 0.01;
    return yGroups.map((name, idx) => {
        const parts = name.split(/\s+/);
        const xPos = -5;
        let yPos = (yScale(name) ?? 0) + yScale.bandwidth() / 2;
        if (parts.length > 2) {
            yPos -= 10;
        }
        return (
            <text
                key={idx}
                x={xPos}
                y={yPos}
                textAnchor="end"
                dominantBaseline="middle"
                fontSize="10"
                className="fill-black dark:fill-slate-300"
            >
                {parts.map((substring, i) => (
                    <tspan
                        key={`${name}-${substring}`}
                        x={xPos}
                        y={yPos}
                        dy={`${i * lineHeight + dyAdjust}em`}
                        style={{
                            fontSize: parts.length < 4 ? 12 : 9,
                        }}
                    >
                        {substring}
                    </tspan>
                ))}
                {/* {name} */}
            </text>
        );
    });
}
