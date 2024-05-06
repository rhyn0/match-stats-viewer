import { BackButton } from "@/components/BackButton";
import React from "react";

export default function StatsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <main>
            <BackButton />
            {children}
        </main>
    );
}
