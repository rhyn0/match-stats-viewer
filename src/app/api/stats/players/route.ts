import { NextResponse } from "next/server";
import db from "@/lib/drizzleLibSQL";
import { calculateKd } from "@/lib/kdCalculation";

export const revalidate = 1800;

export async function GET(): Promise<NextResponse> {
    const playerResult = await db.query.players.findMany({
        columns: {
            id: true,
            name: true,
            teamId: true,
        },
        with: {
            playerMatchesRel: {
                columns: {
                    id: true,
                    matchId: true,
                    playerAgentId: true,
                    matchPlace: true,
                    playerKills: true,
                    playerDeaths: true,
                    playerAssists: true,
                },
                // limit: 1  // limit the relation return if wanted
                with: {
                    matchRel: {
                        columns: {
                            roundCountA: true,
                            roundCountB: true,
                        },
                    },
                },
            },
            teamInfoRel: {
                columns: {
                    teamName: true,
                    defaultName: true,
                },
            },
        },
    });

    const finalStats = playerResult.map((playerStats) => ({
        // @ts-expect-error - cant hint the sub relation
        ...calculateStats(playerStats),
        id: playerStats.id,
        teamName:
            // @ts-expect-error - fails to load the relationship
            playerStats.teamInfoRel.teamName ??
            // @ts-expect-error - fails to load the relationship
            playerStats.teamInfoRel.defaultName,
        playerName: playerStats.name,
    }));

    return new NextResponse(
        JSON.stringify({ rows: finalStats, length: finalStats.length }),
    );
}

interface PlayerMatchRecord {
    id: number;
    matchId: number | null;
    playerAgentId: number | null;
    matchPlace: number;
    playerKills: number;
    playerDeaths: number;
    playerAssists: number;
    matchRel: {
        roundCountA: number;
        roundCountB: number;
    };
}
interface PlayerRow {
    id: number;
    name: string;
    teamId: number | null;
    playerMatchesRel: PlayerMatchRecord[];
}
interface CalculatedStats {
    gamesPlayed: number;
    kdRatio: {
        overall: number;
        min: number;
        max: number;
    };
    roundsPlayed: number;
    totalKills: number;
    totalDeaths: number;
    totalAssists: number;
}
function calculateStats(row: PlayerRow): CalculatedStats {
    const defaultRecord = {
        totalKills: 0,
        totalDeaths: 0,
        totalAssists: 0,
        roundsPlayed: 0,
        kdRatio: {
            min: Number.POSITIVE_INFINITY,
            max: Number.NEGATIVE_INFINITY,
        },
    };
    const { totalKills, totalDeaths, totalAssists, kdRatio, roundsPlayed } =
        row.playerMatchesRel.reduce(
            (
                {
                    totalKills,
                    totalDeaths,
                    totalAssists,
                    kdRatio,
                    roundsPlayed,
                },
                matchRecord,
            ) => {
                const matchKdRatio = calculateKd({
                    kills: matchRecord.playerKills,
                    deaths: matchRecord.playerDeaths,
                });
                const kdMin = Math.min(kdRatio.min, matchKdRatio);
                const kdMax = Math.max(kdRatio.max, matchKdRatio);
                return {
                    totalKills: totalKills + matchRecord.playerKills,
                    totalDeaths: totalDeaths + matchRecord.playerDeaths,
                    totalAssists: totalAssists + matchRecord.playerAssists,
                    roundsPlayed:
                        roundsPlayed +
                        matchRecord.matchRel.roundCountA +
                        matchRecord.matchRel.roundCountB,
                    kdRatio: {
                        min: kdMin,
                        max: kdMax,
                    },
                };
            },
            defaultRecord,
        );
    return {
        totalKills,
        totalDeaths,
        totalAssists,
        roundsPlayed,
        kdRatio: {
            ...kdRatio,
            overall: totalKills / totalDeaths,
        },
        gamesPlayed: row.playerMatchesRel.length,
    };
}
