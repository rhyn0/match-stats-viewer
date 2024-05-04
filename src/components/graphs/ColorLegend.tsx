"use client";
import * as d3 from "d3";
import { useEffect, useRef } from "react";

interface ColorLegendProps {
    height: number;
    width: number;
    colorScale: d3.ScaleSequentialBase<string, never>;
    margin?: { top: number; right: number; bottom: number; left: number };
}

export const ColorLegend = ({
    height,
    colorScale,
    width,
    margin = { top: 38, right: 0, bottom: 38, left: 0 },
}: ColorLegendProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const boundsWidth = width - margin.right - margin.left;
    const boundsHeight = height - margin.top - margin.bottom;

    const domain = colorScale.domain();
    const max = domain[domain.length - 1];
    const xScale = d3.scaleLinear().range([0, boundsWidth]).domain([0, max]);

    const allTicks = xScale.ticks(4).map((tick) => {
        return (
            <>
                <line
                    x1={xScale(tick)}
                    x2={xScale(tick)}
                    y1={0}
                    y2={boundsHeight + 10}
                    className="stroke-black dark:stroke-gray-200"
                    stroke="black"
                />
                <text
                    x={xScale(tick)}
                    y={boundsHeight + 20}
                    fontSize={9}
                    textAnchor="middle"
                    className="fill-black dark:fill-white"
                >
                    {tick}
                </text>
            </>
        );
    });

    useEffect(() => {
        const canvas = canvasRef.current;
        const context = canvas?.getContext("2d");

        if (!context) {
            return;
        }

        for (let i = 0; i < boundsWidth; ++i) {
            context.fillStyle = colorScale((max * i) / boundsWidth);
            context.fillRect(i, 0, 1, boundsHeight);
        }
    }, [width, height, colorScale, boundsWidth, max, boundsHeight]);

    return (
        <div
            style={{
                position: "relative",
                transform: `translate(${margin.left}px,${-margin.top}px)`,
            }}
        >
            <canvas
                id="test"
                ref={canvasRef}
                width={boundsWidth}
                height={boundsHeight}
            ></canvas>
            <svg
                width={boundsWidth}
                height={boundsHeight}
                y={-10}
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    overflow: "visible",
                }}
            >
                {allTicks}
            </svg>
        </div>
    );
};
