"use client";
import { DataT, TeamStatRecord, TeamStatRecordZ, mapNames } from "@/types";
import { DataTable } from "@/components/dataTable";
import { columns } from "./columns";
import React from "react";
import { DialogHeatmap } from "@/components/PopoutHeatmap";
import { handleDivZero } from "@/lib/statsParse";
import { type PaginationState } from "@tanstack/react-table";
import { heatmapStrings } from "@/app/constants";

interface TeamDataT extends DataT {
    wins: number;
    plays: number;
}

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
    const [tablePagination, setTablePagination] =
        React.useState<PaginationState>({
            pageIndex: 0,
            pageSize: 10,
        });

    React.useEffect(() => {
        getTeamStats().then((data) => setTeamData(data));
    }, []);

    if (!teamData) {
        return <div> Loading...</div>;
    }
    return (
        <div>
            <div className="container">
                <div className="flex justify-between">
                    <h1 className="text-3xl">Team Stats</h1>
                    <DialogHeatmap
                        data={formatTeamDataForMap(teamData)}
                        {...heatmapStrings.team}
                        minMax={[0, 1]}
                        extraLabels={[
                            { name: "Wins", key: "wins" },
                            { name: "Times Played", key: "plays" },
                        ]}
                    />
                </div>
                <DataTable
                    data={teamData}
                    columns={columns}
                    columnPinning={{
                        left: ["defaultName", "teamName"],
                    }}
                    pageSizeChangingEnabled={false}
                    pagination={tablePagination}
                    onPaginationChange={setTablePagination}
                />
            </div>
        </div>
    );
}

function formatTeamDataForMap(data: TeamStatRecord[] | undefined): TeamDataT[] {
    if (!data) return [];

    const result = data.flatMap((team) =>
        mapNames.map((mapName) => {
            const mapStats = team.mapStats[mapName] ?? { played: 0, won: 0 };
            return {
                rowKey: team.teamName ?? team.defaultName,
                colKey: mapName,
                value:
                    mapStats.played === 0
                        ? -1
                        : parseFloat(
                              handleDivZero({
                                  wins: mapStats.won,
                                  plays: mapStats.played,
                              }).toFixed(3),
                          ),
                wins: mapStats.won,
                plays: mapStats.played,
            };
        }),
    );
    return result;
}
