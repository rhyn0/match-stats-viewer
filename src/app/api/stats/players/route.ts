import { NextResponse } from "next/server";
import db from "@/lib/drizzlePg";

const exampleData = {
    rows: [
        {
            id: 1,
            playerName: "John",
            teamName: "1",
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
        {
            id: 2,
            playerName: "Jane",
            teamName: "2",
            totalKills: 8,
            totalDeaths: 12,
            totalAssists: 6,
            roundsPlayed: 22,
            agentPlays: {
                1: 0,
            },
            gamesPlayed: 1,
            kdRatio: {
                overall: 0.66667,
                min: 0.66667,
                max: 0.66667,
            },
        },
        {
            id: 3,
            playerName: "Mike",
            teamName: "1",
            totalKills: 12,
            totalDeaths: 8,
            totalAssists: 4,
            roundsPlayed: 26,
            agentPlays: {
                1: 2,
            },
            gamesPlayed: 1,
            kdRatio: {
                overall: 1.5,
                min: 1.5,
                max: 1.5,
            },
        },
        {
            id: 4,
            playerName: "Sarah",
            teamName: "2",
            totalKills: 6,
            totalDeaths: 14,
            totalAssists: 10,
            roundsPlayed: 20,
            agentPlays: {
                1: 1,
            },
            gamesPlayed: 1,
            kdRatio: {
                overall: 0.42857,
                min: 0.42857,
                max: 0.42857,
            },
        },
        {
            id: 5,
            playerName: "Alex",
            teamName: "1",
            totalKills: 14,
            totalDeaths: 6,
            totalAssists: 8,
            roundsPlayed: 28,
            agentPlays: {
                1: 3,
            },
            gamesPlayed: 1,
            kdRatio: {
                overall: 2.33333,
                min: 2.33333,
                max: 2.33333,
            },
        },
        {
            id: 6,
            playerName: "Emily",
            teamName: "2",
            totalKills: 10,
            totalDeaths: 10,
            totalAssists: 10,
            roundsPlayed: 24,
            agentPlays: {
                1: 0,
            },
            gamesPlayed: 1,
            kdRatio: {
                overall: 1.0,
                min: 1.0,
                max: 1.0,
            },
        },
        {
            id: 7,
            playerName: "David",
            teamName: "1",
            totalKills: 8,
            totalDeaths: 12,
            totalAssists: 6,
            roundsPlayed: 22,
            agentPlays: {
                1: 1,
            },
            gamesPlayed: 1,
            kdRatio: {
                overall: 0.66667,
                min: 0.66667,
                max: 0.66667,
            },
        },
        {
            id: 8,
            playerName: "Olivia",
            teamName: "2",
            totalKills: 12,
            totalDeaths: 8,
            totalAssists: 4,
            roundsPlayed: 26,
            agentPlays: {
                1: 2,
            },
            gamesPlayed: 1,
            kdRatio: {
                overall: 1.5,
                min: 1.5,
                max: 1.5,
            },
        },
        {
            id: 9,
            playerName: "Daniel",
            teamName: "1",
            totalKills: 6,
            totalDeaths: 14,
            totalAssists: 10,
            roundsPlayed: 20,
            agentPlays: {
                1: 1,
            },
            gamesPlayed: 1,
            kdRatio: {
                overall: 0.42857,
                min: 0.42857,
                max: 0.42857,
            },
        },
        {
            id: 10,
            playerName: "Sophia",
            teamName: "2",
            totalKills: 14,
            totalDeaths: 6,
            totalAssists: 8,
            roundsPlayed: 28,
            agentPlays: {
                1: 3,
            },
            gamesPlayed: 1,
            kdRatio: {
                overall: 2.33333,
                min: 2.33333,
                max: 2.33333,
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
