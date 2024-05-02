"use client";
import { TeamStatRecord, TeamStatRecordZ } from "@/types";
import { DataTable } from "@/components/dataTable";
import { columns } from "./columns";
import { BackButton } from "@/components/BackButton";
import React from "react";

async function getTeamStats(): Promise<TeamStatRecord[]> {
    const response = await fetch("/api/stats/teams", {
        next: { tags: ["stats", "teams"], revalidate: 60 },
    });
    if (!response.ok) {
        console.error("Error fetching teamStats: ", await response.text());
        return [];
    }
    const data: { rows: unknown[]; length: number } = await response.json();
    try {
        const zData = TeamStatRecordZ.array().parse(data.rows);
        return zData;
    } catch (e) {
        console.error("Unexpected data from PlayerStats: ", e);
        return [];
    }
}

export default function StatPage() {
    const [teamData, setTeamData] = React.useState<
        TeamStatRecord[] | undefined
    >(undefined);

    React.useEffect(() => {
        getTeamStats().then((data) => setTeamData(data));
    }, []);

    if (!teamData) {
        return <div> Loading...</div>;
    }
    return (
        <main>
            <BackButton />
            <div className="container">
                <h1 className="text-3xl">Player Stats</h1>
                <DataTable
                    data={teamData}
                    columns={columns}
                    columnPinning={{
                        left: ["defaultName", "teamName"],
                    }}
                />
            </div>
        </main>
    );
}
