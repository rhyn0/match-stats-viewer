"use client";

import { cn } from "@/lib/utils";
import React from "react";

export interface coloredRatioNumber {
    value: number;
    lowIsGreen?: boolean;
    breakpoint?: number;
    className?: string;
}

export function ColoredRatioNumber({
    value,
    lowIsGreen = false,
    breakpoint = 2.0,
    className,
}: coloredRatioNumber) {
    const determineIfGreen = React.useCallback(
        (val: number) => {
            return lowIsGreen ? val < breakpoint : val > breakpoint;
        },
        [lowIsGreen, breakpoint],
    );
    const isGreen = determineIfGreen(value);
    return (
        <span
            className={cn(
                {
                    "text-green-500": isGreen,
                    "text-red-500": !isGreen,
                },
                className,
            )}
        >
            {value.toFixed(3).toString()}
        </span>
    );
}
