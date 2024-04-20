"use client";

import { useRouter } from "next/navigation";
import { Button } from "./ui/button";

import LeftArrow from "@/../public/img/leftArrow.svg";

export interface BackButtonProps {
    className?: string;
}
export function BackButton({ className }: BackButtonProps) {
    const router = useRouter();

    return (
        <Button
            size="icon"
            variant="outline"
            onClick={() => router.back()}
            className={className}
        >
            <span className="sr-only">Go Back</span>
            <LeftArrow />
        </Button>
    );
}
