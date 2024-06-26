import { NextResponse } from "next/server";
import db from "@/lib/drizzleLibSQL";
import { calculateStats } from "@/lib/player-calculation";
import { calculateAgentsPlayed } from "@/lib/player-calculation";

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
                    agentPlayedByPlayerRel: true,
                },
            },
            teamInfoRel: true,
        },
    });
    const finalStats = playerResult.map((playerStats) => ({
        // @ts-expect-error - cant hint the sub relation
        ...calculateStats(playerStats),
        id: playerStats.id,
        teamName:
            // @ts-expect-error - fails to load the relationship
            playerStats.teamInfoRel?.teamName ??
            // @ts-expect-error - fails to load the relationship
            playerStats.teamInfoRel?.defaultName ??
            "Sub",
        playerName: playerStats.name,
        // @ts-expect-error - cant hint the sub relation
        agentMap: calculateAgentsPlayed(playerStats.playerMatchesRel),
    }));

    return new NextResponse(
        JSON.stringify({ rows: finalStats, length: finalStats.length }),
    );
}
