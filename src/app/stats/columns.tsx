// work on player stats first

import { ColoredRatioNumber } from "@/components/coloredRatioNumber";
import { cn } from "@/lib/utils";
import { OverallPlayerStatRecord } from "@/types";
import { agentNameEnum } from "@db/schema/agent";
import { ColumnDef } from "@tanstack/react-table";

export const columns: ColumnDef<OverallPlayerStatRecord>[] = [
    {
        id: "playerInfo",
        header: "Player Info",
        columns: [
            {
                accessorKey: "playerName",
                header: "Player",
                meta: {
                    filterVariant: "text",
                },
            },
            {
                accessorKey: "teamName",
                header: "Team Name",
                meta: {
                    filterVariant: "select",
                },
            },
        ],
    },
    {
        id: "sumStats",
        header: "Summary Stats",
        columns: [
            {
                accessorKey: "totalKills",
                header: "Total Kills",
                meta: {
                    filterVariant: "range",
                },
            },
            {
                accessorKey: "totalDeaths",
                header: "Total Deaths",
                meta: {
                    filterVariant: "range",
                },
            },
            {
                accessorKey: "totalAssists",
                header: "Total Assists",
                meta: {
                    filterVariant: "range",
                },
            },
        ],
    },
    {
        id: "matchStats",
        header: "Match Stats",
        columns: [
            {
                accessorKey: "roundsPlayed",
                header: "Total Rounds Played",
                meta: {
                    filterVariant: "range",
                },
            },
            {
                accessorKey: "gamesPlayed",
                header: "Total Games Played",
                meta: {
                    filterVariant: "range",
                },
            },
        ],
    },
    {
        id: "kdaStats",
        header: "KDA Stats",
        columns: [
            {
                accessorKey: "kdRatio.overall",
                header: "Overall KD Ratio",
                meta: {
                    filterVariant: "range",
                },
                cell: ({ getValue }) => (
                    <ColoredRatioNumber
                        value={getValue()}
                        breakpoint={1.0}
                    />
                ),
            },
            {
                accessorKey: "kdRatio.min",
                header: "Min KD Ratio",
                meta: {
                    filterVariant: "range",
                },
                cell: ({ getValue }) => (
                    <ColoredRatioNumber
                        value={getValue()}
                        breakpoint={1.0}
                    />
                ),
            },
            {
                accessorKey: "kdRatio.max",
                header: "Max KD Ratio",
                meta: {
                    filterVariant: "range",
                },
                cell: ({ getValue }) => (
                    <ColoredRatioNumber
                        value={getValue()}
                        breakpoint={1.0}
                    />
                ),
            },
        ],
    },
    {
        id: "agentStats",
        header: "Agent Stats",
        columns: agentNameEnum.map((agentName) => ({
            id: agentName,
            accessorFn: (row) => row.agentMap[agentName] ?? 0,
            header: agentName,
            meta: {
                filterVariant: "range",
            },
            cell: ({ getValue, row: { getValue: getRowValue } }) => {
                const rowAgentPlays: number[] = agentNameEnum.map((name) =>
                    getRowValue(name),
                );
                const maxAgentPlay = rowAgentPlays.reduce(
                    (acc, val) => (acc > val ? acc : val),
                    Number.NEGATIVE_INFINITY,
                );
                const minAgentPlay = rowAgentPlays.reduce(
                    (acc, val) => (acc < val ? acc : val),
                    Number.POSITIVE_INFINITY,
                );
                const currAgentPlay = getValue();
                return (
                    <div
                        className={cn("h-10 w-10 p-2 text-center", {
                            "bg-red-500": currAgentPlay === minAgentPlay,
                            "bg-blue-400":
                                minAgentPlay < currAgentPlay &&
                                currAgentPlay < maxAgentPlay,
                            "bg-green-600": currAgentPlay === maxAgentPlay,
                        })}
                    >
                        {currAgentPlay}
                    </div>
                );
            },
        })),
    },
];
