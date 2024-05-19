import { NextRequest, NextResponse } from "next/server";
import { eq, or } from "drizzle-orm";
import db from "@/lib/drizzleLibSQL";
import { UploadMatchData } from "@/types";
import schema from "@db/schema";

// @ts-expect-error - the type for tx is insane
async function getTeamId(tx, name: string): Promise<{ teamId: number }[]> {
    return await tx
        .select({ teamId: schema.teams.id })
        .from(schema.teams)
        .where(
            or(
                eq(schema.teams.teamName, name),
                eq(schema.teams.defaultName, name),
            ),
        );
}

// @ts-expect-error - the type for tx is insane
async function getMapId(tx, name: string): Promise<{ mapId: number }[]> {
    return await tx
        .select({ mapId: schema.maps.id })
        .from(schema.maps)
        .where(eq(schema.maps.name, name));
}

export async function POST(request: NextRequest): Promise<NextResponse> {
    const body: UploadMatchData[] = await request.json();
    const errors = [];
    for (const match of body) {
        try {
            await db.transaction(async (tx) => {
                // individually insert player names, because one could be missing. If done as whole batch, whole thing is cancelled
                for (const player of match.playerNames) {
                    await tx
                        .insert(schema.players)
                        .values({ name: player })
                        .onConflictDoNothing({ target: schema.players.name });
                }
                // match transaction has a few pre selects
                let matchId: number;
                await tx.transaction(async (tx2) => {
                    const teamAResult = await getTeamId(
                        tx2,
                        match.matchRecord.teamAName,
                    );
                    const teamBResult = await getTeamId(
                        tx2,
                        match.matchRecord.teamBName,
                    );
                    const teamAId = teamAResult[0].teamId;
                    const teamBId = teamBResult[0].teamId;
                    const mapResult = await getMapId(
                        tx2,
                        match.matchRecord.mapName,
                    );
                    const mapId = mapResult[0].mapId;
                    const result = await tx2
                        .insert(schema.matches)
                        .values({
                            teamAName: match.matchRecord.teamAName,
                            teamA: teamAId,
                            teamBName: match.matchRecord.teamBName,
                            teamB: teamBId,
                            mapPlayedId: mapId,
                            rawRoundCount: match.matchRecord.roundCount.raw,
                            roundCountA: match.matchRecord.roundCount.roundsA,
                            roundCountB: match.matchRecord.roundCount.roundsB,
                            // since this is from a JSON parse, Date object is not preserved
                            playDate: new Date(match.matchRecord.date),
                            isPlayoffs: match.isPlayoffs,
                        })
                        .returning({ matchId: schema.matches.id });
                    matchId = result[0].matchId;
                });
                // insert individual player stats for this match
                await tx.transaction(async (tx3) => {
                    for (
                        let idx = 0;
                        idx < match.playerMatchRecords.length;
                        ++idx
                    ) {
                        const pmRecord = match.playerMatchRecords[idx];
                        const {
                            raw: rawKDA,
                            kills: playerKills,
                            deaths: playerDeaths,
                            assists: playerAssists,
                        } = pmRecord.kda;
                        const { id: playerId } = (
                            await tx3
                                .select({ id: schema.players.id })
                                .from(schema.players)
                                .where(
                                    eq(
                                        schema.players.name,
                                        pmRecord.playerName,
                                    ),
                                )
                        )[0]; // should only be one match. unique player names
                        const { id: playerAgentId } = (
                            await tx3
                                .select({ id: schema.agents.id })
                                .from(schema.agents)
                                .where(
                                    eq(schema.agents.name, pmRecord.agentName),
                                )
                        )[0]; // should only be one match
                        await tx3.insert(schema.playerMatches).values({
                            playerId,
                            matchId,
                            playerAgentId,
                            matchPlace: idx + 1,
                            rawKDA,
                            playerKills,
                            playerDeaths,
                            playerAssists,
                        });
                    }
                });
            });
        } catch (e) {
            console.error(e);
            errors.push(e);
        }
    }
    if (errors.length > 0) {
        return new NextResponse(JSON.stringify(errors), { status: 404 });
    }

    return new NextResponse("successful post", { status: 200 });
}
