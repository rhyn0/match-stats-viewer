"use server";
import db from "@/lib/drizzleLibSQL";
import { sql, eq, and, or, sum } from "drizzle-orm";
import { teams } from "@db/schema/team";
import { matches } from "@db/schema/match";
import { TeamH2HOverall, TeamHeadToHead, TeamIdentifiers } from "@/types";

export async function getTeamIds(): Promise<TeamIdentifiers[]> {
    return db
        .select({
            teamId: teams.id,
            teamName: sql<string>`coalesce(${teams.teamName},${teams.defaultName})`,
        })
        .from(teams)
        .orderBy(teams.id);
}

export async function getTeamHeadToHead({
    teamAId,
    teamBId,
}: {
    teamAId: number;
    teamBId: number;
}): Promise<TeamHeadToHead[]> {
    const result = await db
        .select({
            winnerId: sql<number>`CASE WHEN ${matches.roundCountA} > ${matches.roundCountB}
                THEN ${matches.teamA}
                ELSE ${matches.teamB}
                END`,
            winnerName: sql<string>`CASE WHEN ${matches.roundCountA} > ${matches.roundCountB}
                    THEN ${matches.teamAName}
                    ELSE ${matches.teamBName}
                    END`,
            roundDiff: sql<number>`ABS(${matches.roundCountA} - ${matches.roundCountB})`,
        })
        .from(matches)
        .where(
            and(
                or(eq(matches.teamA, teamAId), eq(matches.teamA, teamBId)),
                or(eq(matches.teamB, teamAId), eq(matches.teamB, teamBId)),
            ),
        )
        .groupBy(({ winnerId, winnerName }) => [winnerId, winnerName]);
    return result;
}

export async function getTeamOverall(teamId: number): Promise<TeamH2HOverall> {
    const cte = db.$with("cte").as(
        db
            .select({
                isTeamA: eq(matches.teamA, teamId).as("isTeamA"),
                roundsForA: matches.roundCountA,
                roundsForB: matches.roundCountB,
                roundDiffInFavor:
                    sql<number>`CASE WHEN ${matches.teamA} = ${teamId}
                THEN ${matches.roundCountA} - ${matches.roundCountB}
                ELSE ${matches.roundCountB} - ${matches.roundCountA}
                END`.as("roundDiffInFavor"),
            })
            .from(matches)
            .where(or(eq(matches.teamA, teamId), eq(matches.teamB, teamId))),
    );
    const result = await db
        .with(cte)
        .select({
            numWin: sum(sql<number>`CASE WHEN (${cte.roundsForA} > ${cte.roundsForB} AND ${cte.isTeamA})
        OR (${cte.roundsForA} < ${cte.roundsForB} AND NOT ${cte.isTeamA}) THEN 1 ELSE 0 END`),
            numLoss:
                sum(sql<number>`CASE WHEN (${cte.roundsForA} < ${cte.roundsForB} AND ${cte.isTeamA}) OR
        (${cte.roundsForA} > ${cte.roundsForB} AND NOT ${cte.isTeamA}) THEN 1 ELSE 0 END`),
            roundDiff: sum(cte.roundDiffInFavor),
        })
        .from(cte);

    const oneTeam = result[0];

    return {
        teamId,
        roundDiff: parseInt(oneTeam.roundDiff as string),
        mapDiff:
            parseInt(oneTeam.numWin as string) -
            parseInt(oneTeam.numLoss as string),
    };
}
