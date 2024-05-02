// work on player stats first
import { ColoredRatioNumber } from "@/components/coloredRatioNumber";
import { handleDivZero } from "@/lib/statsParse";
import { TeamStatRecord, mapNames } from "@/types";
import { createColumnHelper } from "@tanstack/react-table";

const teamColumnHelper = createColumnHelper<TeamStatRecord>();

export const columns = [
    teamColumnHelper.group({
        header: "Team Info",
        columns: [
            teamColumnHelper.accessor("defaultName", {
                header: "Team Name",
                meta: {
                    filterVariant: "select",
                },
            }),
            teamColumnHelper.accessor("teamName", {
                header: "Display Name",
                meta: {
                    filterVariant: "select",
                },
            }),
        ],
    }),
    teamColumnHelper.group({
        header: "Match Stats",
        columns: [
            teamColumnHelper.accessor("mapsPlayed", {
                header: "Maps Played Count",
                meta: {
                    filterVariant: "range",
                },
            }),
            teamColumnHelper.accessor("overtimes", {
                header: "Number of Overtimes",
                meta: {
                    filterVariant: "range",
                },
            }),
        ],
    }),
    teamColumnHelper.group({
        header: "Round Stats",
        columns: [
            teamColumnHelper.accessor("roundStats.won", {
                header: "Won",
                meta: {
                    filterVariant: "range",
                },
            }),
            teamColumnHelper.accessor("roundStats.played", {
                header: "Played",
                meta: {
                    filterVariant: "range",
                },
            }),
            teamColumnHelper.accessor(
                (row) =>
                    (row.roundStats.won / row.roundStats.played).toFixed(3),
                {
                    header: "Win Rate",
                },
            ),
        ],
    }),
    teamColumnHelper.group({
        header: "Map Stats",
        columns: mapNames.map((mapName) =>
            teamColumnHelper.group({
                header: mapName,
                columns: [
                    teamColumnHelper.accessor(
                        (row) => row.mapStats[mapName]?.won ?? 0,
                        {
                            header: `${mapName} Wins`,
                            meta: {
                                filterVariant: "range",
                            },
                        },
                    ),
                    teamColumnHelper.accessor(
                        (row) => row.mapStats[mapName]?.played ?? 0,
                        {
                            header: `${mapName} Times Played`,
                            meta: {
                                filterVariant: "range",
                            },
                        },
                    ),
                    teamColumnHelper.accessor(
                        (row) => {
                            const wins = row.mapStats[mapName]?.won ?? 0;
                            const plays = row.mapStats[mapName]?.played ?? 0;
                            return plays === 0
                                ? -1
                                : handleDivZero({
                                      wins,
                                      plays,
                                  });
                        },
                        {
                            header: `${mapName} Win Ratio`,
                            meta: {
                                filterVariant: "range",
                            },
                            cell: ({ getValue }) => (
                                <>
                                    {getValue() === -1 ? (
                                        "Never Played"
                                    ) : (
                                        <ColoredRatioNumber
                                            value={getValue()}
                                            breakpoint={0.5}
                                        />
                                    )}
                                </>
                            ),
                        },
                    ),
                ],
            }),
        ),
    }),
];
