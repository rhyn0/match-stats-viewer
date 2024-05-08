import { NextResponse } from "next/server";
import db from "@/lib/drizzleLibSQL";
import { TeamStatRecord, mapStats } from "@/types";

export const revalidate = 1800;

export async function GET(): Promise<NextResponse> {
    const teamResult = await db.query.teams.findMany({
        columns: {
            id: false,
            modifiedAt: false,
        },
        with: {
            matchesForTeamARel: {
                columns: {
                    teamAName: true,
                    roundCountA: true,
                    roundCountB: true,
                },
                with: {
                    mapForMatchRel: {
                        columns: {
                            name: true,
                        },
                    },
                },
            },
            matchesForTeamBRel: {
                columns: {
                    teamBName: true,
                    roundCountA: true,
                    roundCountB: true,
                },
                with: {
                    mapForMatchRel: {
                        columns: {
                            name: true,
                        },
                    },
                },
            },
        },
    });
    const finalStats: TeamStatRecord[] = teamResult.map((teamStat) => ({
        // @ts-expect-error - missing type hinting for relation query
        ...calculateTeamStats(teamStat),
        teamName: teamStat.teamName ?? "",
        defaultName: teamStat.defaultName,
    }));
    return new NextResponse(
        JSON.stringify({ rows: finalStats, length: finalStats.length }),
    );
}

interface TeamRow {
    defaultName: string;
    teamName: string;
    matchesForTeamARel: MatchStatsA[];
    matchesForTeamBRel: MatchStatsB[];
}
interface MapNameRelation {
    mapForMatchRel: {
        name: string;
    };
}
interface RoundsPlayedForMap extends MapNameRelation {
    roundCountA: number;
    roundCountB: number;
}
interface MatchStatsA extends RoundsPlayedForMap {
    teamAName: string;
}
interface MatchStatsB extends RoundsPlayedForMap {
    teamBName: string;
}
function calculateTeamStats(
    teamRow: TeamRow,
): Omit<TeamStatRecord, "teamName" | "defaultName"> {
    const mapsPlayed =
        teamRow.matchesForTeamARel.length + teamRow.matchesForTeamBRel.length;
    const roundStats: { won: number; played: number } = { won: 0, played: 0 };
    let overtimes = 0;
    const runningStats = new Map();
    for (const aRecord of teamRow.matchesForTeamARel) {
        const prevValue: mapStats = runningStats.get(
            aRecord.mapForMatchRel.name,
        ) ?? { played: 0, won: 0 };
        prevValue.played += 1;
        if (aRecord.roundCountA > aRecord.roundCountB) {
            prevValue.won += 1;
        }
        runningStats.set(aRecord.mapForMatchRel.name, prevValue);
        // determine overtime
        if (aRecord.roundCountA + aRecord.roundCountB > 24) {
            overtimes += 1;
        }
        roundStats.won += aRecord.roundCountA;
        roundStats.played += aRecord.roundCountA + aRecord.roundCountB;
    }

    for (const bRecord of teamRow.matchesForTeamBRel) {
        const prevValue: mapStats = runningStats.get(
            bRecord.mapForMatchRel.name,
        ) ?? { played: 0, won: 0 };
        prevValue.played += 1;
        if (bRecord.roundCountA < bRecord.roundCountB) {
            prevValue.won += 1;
        }
        runningStats.set(bRecord.mapForMatchRel.name, prevValue);
        // determine overtime
        if (bRecord.roundCountA + bRecord.roundCountB > 24) {
            overtimes += 1;
        }
        roundStats.won += bRecord.roundCountB;
        roundStats.played += bRecord.roundCountA + bRecord.roundCountB;
    }

    return {
        overtimes,
        roundStats,
        mapStats: Object.fromEntries(runningStats.entries()),
        mapsPlayed,
    };
}
