import { z } from "zod";
export interface OverallPlayerStatRecord {
    // fields from request directly
    id: number;
    playerName: string;
    teamName: string;
    totalKills: number;
    totalDeaths: number;
    totalAssists: number;
    roundsPlayed: number;
    // agentPlays: Record<number, number>;
    // to be calculated fields, maybe in SQL
    gamesPlayed: number;
    kdRatio: {
        overall: number;
        min: number;
        max: number;
    };
}

export const PlayerStatRecordZ = z.object({
    id: z.number(),
    playerName: z.string(),
    teamName: z.string(),
    totalKills: z.number(),
    totalDeaths: z.number(),
    totalAssists: z.number(),
    roundsPlayed: z.number(),
    // agentPlays: z.record<z.ZodNumber, z.ZodNumber>(
    //     z.coerce.number(),
    //     z.number(),
    // ),
    // to be calculated fields, maybe in SQL
    gamesPlayed: z.number(),
    kdRatio: z.object({
        overall: z.number(),
        min: z.number(),
        max: z.number(),
    }),
}) satisfies z.ZodType<OverallPlayerStatRecord>;

export type FilterVariantType = "text" | "range" | "select";

export interface UploadMatchData {
    matchRecord: MatchRecord;
    playerNames: string[];
    playerMatchRecords: PlayerMatchRecord[];
}

export interface MatchRecord {
    teamAName: string;
    teamBName: string;
    roundCount: {
        raw: string;
        roundsA: number;
        roundsB: number;
    };
    date: Date;
    mapName: string;
}

export interface PlayerMatchRecord {
    playerName: string;
    agentName: string;
    kda: {
        raw: string;
        kills: number;
        deaths: number;
        assists: number;
    };
}
export const roundCountRegex = /(\d{1,2})-(\d{1,2})/;
export const kdaRegex = /(\d+)\/(\d+)\/(\d+)/;
