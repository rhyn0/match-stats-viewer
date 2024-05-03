"use client";
import { RangeHeatMap } from "@/components/graphs/RangeHeatmap";
import React from "react";

const alphabet = "ABCDEFGHIJKLMNOP";

function generateData() {
    const column = Array(10)
        .fill(0)
        .map((v, idx) => ({ colName: alphabet.slice(idx + 1, idx + 2) }));
    return Array(10)
        .fill(0)
        .flatMap((v, idx) =>
            column.map(({ colName }) => ({
                colName,
                rowName: alphabet.slice(idx, idx + 1),
                value: Math.random() * 100 + 10,
            })),
        );
}
export default function Page() {
    const [data, setData] = React.useState(generateData());
    React.useEffect(() => {
        const interval = setInterval(() => setData(generateData()), 2000);
        return () => clearInterval(interval);
    }, []);
    return (
        <main className="container flex justify-center pt-10 text-white">
            <RangeHeatMap
                data={data}
                columnKey="colName"
                rowKey="rowName"
                width={450}
                height={450}
            />
        </main>
    );
}
