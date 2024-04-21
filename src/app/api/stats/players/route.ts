import { NextResponse } from "next/server";
import db from "@/lib/drizzlePg";

const exampleData = {
    rows: [
        {
            id: 1,
            playerName: "John",
            teamId: 1,
            totalKills: 10,
            totalDeaths: 10,
            totalAssists: 10,
            roundsPlayed: 24,
            agentPlays: {
                1: 1,
            },
            // this can either be calculated here or in SQL
            gamesPlayed: 1,
            kdRatio: {
                overall: 1.01134,
                min: 1.01134,
                max: 1.01134,
            },
        },
    ],
    length: 10,
};

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
            },
        },
    });

    console.table(playerResult);
    console.log(playerResult[0].playerMatchesRel);

    return new NextResponse(JSON.stringify(exampleData));
}
