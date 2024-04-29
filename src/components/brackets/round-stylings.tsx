"use client";

import { ISeedProps } from "@/types";
import { cn } from "@/lib/utils";
import React from "react";
import useMedia from "@/components/hooks/useMedia";
import { type VariantProps, cva } from "class-variance-authority";

const bracketVariants = cva("flex", {
    variants: {
        variant: {
            bracket: "flex-row",
            round: "flex-grow-0 flex-col",
            roundTitle: "font-normal text-center text-[#8f8f8f]",
            seedList:
                "m-0 p-0 flex-col flex-wrap justify-center h-full list-none",
        },
    },
    defaultVariants: {
        variant: "bracket",
    },
});

export interface BracketElementProps
    extends VariantProps<typeof bracketVariants>,
        ISeedProps {
    className?: React.HTMLProps<"div">["className"];
    children?: React.ReactNode;
}
const BracketDiv = React.forwardRef<HTMLDivElement, BracketElementProps>(
    ({ mobileBreakpoint = 992, children, variant, className }, ref) => {
        const isSmallerThanBreakpoint = useMedia(mobileBreakpoint);
        return (
            <div
                ref={ref}
                className={cn(bracketVariants({ variant, className }), {
                    "flex-col":
                        (variant === "bracket" || variant === "round") &&
                        isSmallerThanBreakpoint,
                })}
            >
                {children}
            </div>
        );
    },
);
BracketDiv.displayName = "BracketDiv";

export { BracketDiv };
