import { NextResponse } from "next/server";
import db from "@/lib/drizzleLibSQL";
import { TeamStatRecord } from "@/types";
import { calculateTeamStats } from "@/lib/team-calculation";

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
