import { NextResponse } from "next/server";
import db from "@/lib/drizzleLibSQL";
import { TeamStatRecord } from "@/types";
import { calculateTeamStats } from "@/lib/team-calculation";
import { eq } from "drizzle-orm";
import { matches } from "@db/schema/match";

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
                    isPlayoffs: true,
                },
                with: {
                    mapForMatchRel: {
                        columns: {
                            name: true,
                        },
                    },
                },
                where: eq(matches.isPlayoffs, true),
            },
            matchesForTeamBRel: {
                columns: {
                    teamBName: true,
                    roundCountA: true,
                    roundCountB: true,
                    isPlayoffs: true,
                },
                with: {
                    mapForMatchRel: {
                        columns: {
                            name: true,
                        },
                    },
                },
                where: eq(matches.isPlayoffs, true),
            },
        },
    });
    const playoffsTeamResult = teamResult.filter(
        (team) =>
            // @ts-expect-error - cant type hint the depth of the relation
            team.matchesForTeamARel.length > 0 ||
            // @ts-expect-error - cant type hint the depth of the relation
            team.matchesForTeamBRel.length > 0,
    );
    const finalStats: TeamStatRecord[] = playoffsTeamResult.map((teamStat) => ({
        // @ts-expect-error - missing type hinting for relation query
        ...calculateTeamStats(teamStat),
        teamName: teamStat.teamName ?? "",
        defaultName: teamStat.defaultName,
    }));
    return new NextResponse(
        JSON.stringify({ rows: finalStats, length: finalStats.length }),
    );
}
