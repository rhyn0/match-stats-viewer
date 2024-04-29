"use client";

import { ISeedProps } from "@/types";
import { cn } from "@/lib/utils";
import React from "react";
import useMedia from "@/components/hooks/useMedia";
import { type VariantProps, cva } from "class-variance-authority";

const teamVariants = cva("", {
    variants: {
        variant: {
            item: "text-[#fff] w-full bg-[#1a1d2e] p-0 border-1 shadow shadow-[#111630] text-center relative",
            team: "flex px-1 px-2 justify-between items-center rounded",
            time: "mt-0.5 text-xs text-[#8f8f8f] h-0",
            singleLine:
                "px-4 py-6 min-w-[225px] w-full relative flex items-center flex-grow-0 flex-shrink flex-col justify-center ",
            /*
             * Difference between "SingleLineSeed" and "Seed" is that single line seed
             * will directly connect to the next node, it's good for double elimination losing brackets.
             *
             * The best behavior in such case is, to check if the next round seeds matches the current round seeds
             */
            seed: "",
        },
    },
    defaultVariants: {
        variant: "seed",
    },
});

export interface TeamElementProps
    extends VariantProps<typeof teamVariants>,
        ISeedProps {
    className?: React.HTMLProps<"div">["className"];
    children?: React.ReactNode;
}
const TeamElementDiv = React.forwardRef<HTMLDivElement, TeamElementProps>(
    ({ mobileBreakpoint = 992, children, variant, className }, ref) => {
        const isSmallerThanBreakpoint = useMedia(mobileBreakpoint);
        return (
            <div
                ref={ref}
                className={cn(teamVariants({ variant, className }), {
                    "h-auto": variant === "time" && isSmallerThanBreakpoint,
                    "w-full":
                        variant === "singleLine" && isSmallerThanBreakpoint,
                    "": variant === "singleLine" && !isSmallerThanBreakpoint,
                })}
            >
                {children}
            </div>
        );
    },
);
TeamElementDiv.displayName = "TeamElementDiv";

export { TeamElementDiv };

export const SingleLineSeed = styled.div<ISeedProps>(
    (props) => `
padding: 1em 1.5em;
min-width: 225px;
width:100%;
position: relative;
display: flex;
align-items: center;
flex: 0 1 auto;
flex-direction: column;
justify-content: center;
font-size: 14px;
@media (max-width: ${props.mobileBreakpoint}px) {
  width:100%;
}
@media (min-width: ${(props.mobileBreakpoint || 0) + 1}px) {
  &::after {
      content: "";
      position: absolute;
      height: 50%;
      width: 3em;
    [dir="rtl"] & {
      left: -1.5em;
    }
    [dir="ltr"] & {
      right: -1.5em;
    }
  }
  &:nth-child(even)::after {
    border-bottom: 1px solid #707070;
    top: -0.5px;
  }
  &:nth-child(odd)::after {
    border-top: 1px solid #707070;
    top: calc(50% - 0.5px);
  }
}
`,
);

export const Seed = styled.div<ISeedProps>(
    (props) => `
  padding: 1em 1.5em;
  min-width: 225px;
  width:100%;
  position: relative;
  display: flex;
  align-items: center;
  flex: 0 1 auto;
  flex-direction: column;
  justify-content: center;
  font-size: 14px;
  @media (max-width: ${props.mobileBreakpoint}px) {
    width:100%;
  }
  @media (min-width: ${(props.mobileBreakpoint || 0) + 1}px) {
    &::after {
        content: "";
        position: absolute;
        height: 50%;
        width: 1.5em;
      [dir="rtl"] & {
        left: 0px;
      }
      [dir="ltr"] & {
        right: 0px;
      }
    }

    &:nth-child(even)::before{
      content:'';
      border-top: 1px solid #707070;
      position:absolute;
      top: -0.5px;
      width:1.5em;
      [dir="rtl"] & {
        left:-1.5em;
        }
      [dir="ltr"] & {
        right:-1.5em;
      }
    }

    &:nth-child(even)::after {
      border-bottom: 1px solid #707070;
      top: -0.5px;
     [dir="rtl"] & {
        border-left: 1px solid #707070;
        }
      [dir="ltr"] & {
        border-right: 1px solid #707070;
      }
    }
    &:nth-child(odd):not(:last-child)::after {
      border-top: 1px solid #707070;
      top: calc(50% - 0.5px);
      [dir="rtl"] & {
        border-left: 1px solid #707070;
        }
      [dir="ltr"] & {
        border-right: 1px solid #707070;
      }
    }
}
`,
);
