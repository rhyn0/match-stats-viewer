"use client";
import { OverallPlayerStatRecord, PlayerStatRecordZ } from "@/types";
import { DataTable } from "@/components/dataTable";
import { columns } from "./columns";
import { BackButton } from "@/components/BackButton";
import React from "react";

async function getPlayerStats(): Promise<OverallPlayerStatRecord[]> {
    const response = await fetch("/api/stats/players", {
        next: { tags: ["stats", "players"], revalidate: 60 },
    });
    if (!response.ok) {
        console.error("Error fetching playerStats: ", await response.text());
        return [];
    }
    const data: { rows: unknown[]; length: number } = await response.json();
    try {
        const zData = PlayerStatRecordZ.array().parse(data.rows);
        return zData;
    } catch (e) {
        console.error("Unexpected data from PlayerStats: ", e);
        return [];
    }
}

export default function StatPage() {
    const [playerData, setPlayerData] = React.useState<
        OverallPlayerStatRecord[] | undefined
    >(undefined);
    React.useEffect(() => {
        getPlayerStats().then((data) => setPlayerData(data));
    }, []);

    if (!playerData) {
        return <div> Loading...</div>;
    }
    return (
        <main>
            <BackButton />
            <div className="container">
                <h1 className="text-3xl">Player Stats</h1>
                <DataTable
                    data={playerData}
                    columns={columns}
                />
            </div>
        </main>
    );
}
