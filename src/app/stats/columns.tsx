// work on player stats first

import { OverallPlayerStatRecord } from "@/types";
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
            },
            {
                accessorKey: "kdRatio.min",
                header: "Min KD Ratio",
                meta: {
                    filterVariant: "range",
                },
            },
            {
                accessorKey: "kdRatio.max",
                header: "Max KD Ratio",
                meta: {
                    filterVariant: "range",
                },
            },
        ],
    },
];
