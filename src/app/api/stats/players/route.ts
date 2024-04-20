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
        },
    ],
    length: 10,
};

export async function GET(): Promise<NextResponse> {
    const playerResult = await db.query.players.findMany();
    console.table(playerResult);
    return new NextResponse(JSON.stringify(exampleData));
}
