"use client";
import { DataT, OverallPlayerStatRecord, PlayerStatRecordZ } from "@/types";
import { DataTable } from "@/components/dataTable";
import { columns } from "./columns";
import React from "react";
import { DialogHeatmap } from "@/components/PopoutHeatmap";
import { type PaginationState } from "@tanstack/react-table";
import { agentNameEnum } from "@db/schema/agent";
import { heatmapStrings } from "@/app/constants";

interface PlayerDataT extends DataT {
    plays: number;
}

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
    const [tablePagination, setTablePagination] =
        React.useState<PaginationState>({
            pageIndex: 0,
            pageSize: 10,
        });

    React.useEffect(() => {
        getPlayerStats().then((data) => setPlayerData(data));
    }, []);

    if (!playerData) {
        return <div> Loading...</div>;
    }
    return (
        <div>
            <div className="container">
                <div className="flex justify-between">
                    <h1 className="text-3xl">Player Stats</h1>
                    <DialogHeatmap
                        data={formatPlayerDataForHeatmap(
                            playerData,
                            tablePagination,
                        )}
                        {...heatmapStrings.player}
                        extraLabels={[{ name: "Times Played", key: "plays" }]}
                        disableColLabels={tablePagination.pageSize > 5}
                    />
                </div>
                <DataTable
                    data={playerData}
                    columns={columns}
                    columnPinning={{
                        left: ["playerName", "teamName"],
                    }}
                    pagination={tablePagination}
                    onPaginationChange={setTablePagination}
                />
            </div>
        </div>
    );
}

function formatPlayerDataForHeatmap(
    data: OverallPlayerStatRecord[] | undefined,
    pagination: PaginationState,
): PlayerDataT[] {
    if (!data) return [];

    return data
        .slice(
            pagination.pageIndex * pagination.pageSize,
            (pagination.pageIndex + 1) * pagination.pageSize,
        )
        .flatMap((playerRec) =>
            // reverse here because we are building the rectangles from bottom left
            // so first agentName becomes bottom row of each map
            // want to preserver alphabetical order
            agentNameEnum.toReversed().map((agentName) => {
                const agentPlays = playerRec.agentMap[agentName] ?? 0;
                return {
                    colKey: playerRec.playerName,
                    rowKey: agentName,
                    value: agentPlays,
                    plays: agentPlays,
                };
            }),
        );
}
