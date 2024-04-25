import { NextResponse } from "next/server";
import db from "@/lib/drizzleLibSQL";

const exampleData = {
    rows: [
        {
            id: 1,
            defaultName: "Team 1",
            teamName: "First Place Tobe",
            modifiedAt: new Date(2024, 4, 12, 0, 0, 0),
            roundsPlayed: 24,
            roundsWon: 11,
            overtimesPlayed: 0,
            mapStats: {
                1: {
                    wins: 0,
                    plays: 1,
                },
            },
        },
    ],
    length: 2,
};

export async function GET(): Promise<NextResponse> {
    const teamResult = await db.query.teams.findMany();
    console.table(teamResult);
    return new NextResponse(JSON.stringify(exampleData));
}
