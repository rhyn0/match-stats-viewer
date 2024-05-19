import { NextResponse } from "next/server";
import db from "@/lib/drizzleLibSQL";
import {
    calculateAgentsPlayed,
    calculateStats,
} from "@/lib/player-calculation";
import { eq } from "drizzle-orm";
import { matches } from "@db/schema/match";

export const revalidate = 1800;

interface PlayerMatchRel {
    id: number;
    matchId: number;
    playerAgentId: number;
    matchPlace: number;
    playerKills: number;
    playerDeaths: number;
    playerAssists: number;
    matchRel: {
        roundCountA: number;
        roundCountB: number;
        isPlayoffs: boolean;
    };
}
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
                with: {
                    matchRel: {
                        columns: {
                            roundCountA: true,
                            roundCountB: true,
                        },
                        where: eq(matches.isPlayoffs, true),
                    },
                    agentPlayedByPlayerRel: true,
                },
            },
            teamInfoRel: true,
        },
    });
    const playersInPlayoffs = playerResult
        .map((player) => ({
            ...player,
            // prettier-ignore
            playerMatchesRel: // @ts-expect-error - can't hint the depth of type
            (player.playerMatchesRel as PlayerMatchRel[]).filter(
                // since we `WHERE is_playoffs = true` this can be null if no match
                // we want to eliminate matches that aren't playoffs
                (playerMatch) => Boolean(playerMatch.matchRel),
            ),
        }))
        .filter((player) => player.playerMatchesRel.length > 0);
    const finalStats = playersInPlayoffs.map((playerStats) => ({
        ...calculateStats(
            // @ts-expect-error - playerStats can't be hinted to proper depth
            playerStats,
        ),
        id: playerStats.id,
        teamName:
            // @ts-expect-error - fails to load the relationship
            playerStats.teamInfoRel?.teamName ??
            // @ts-expect-error - fails to load the relationship
            playerStats.teamInfoRel?.defaultName ??
            "Sub",
        playerName: playerStats.name,
        agentMap: calculateAgentsPlayed(
            // @ts-expect-error - cant hint the sub relation
            playerStats.playerMatchesRel,
        ),
    }));

    return new NextResponse(
        JSON.stringify({ rows: finalStats, length: finalStats.length }),
    );
}
