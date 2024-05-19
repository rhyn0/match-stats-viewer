import { agentNameEnum, agentTypeEnum } from "@db/schema/agent";
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
    agentMap: Partial<Record<(typeof agentNameEnum)[number], number>>;
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
    agentMap: z.record(z.enum(agentNameEnum), z.number()),
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

export const mapNames = [
    "Ascent",
    "Bind",
    "Breeze",
    "Icebox",
    "Lotus",
    "Split",
    "Sunset",
] as const;
export type mapNameEnum = (typeof mapNames)[number];
export interface mapStats {
    played: number;
    won: number;
}
export interface TeamStatRecord {
    teamName?: string;
    defaultName: string;
    mapsPlayed: number;
    mapStats: Partial<Record<mapNameEnum, mapStats>>;
    roundStats: {
        won: number;
        played: number;
    };
    overtimes: number;
}

export const TeamStatRecordZ = z.object({
    teamName: z.string().optional(),
    defaultName: z.string().min(1),
    mapsPlayed: z.number().finite(),
    mapStats: z.record(
        z.enum(mapNames),
        z.object({
            played: z.number().finite(),
            won: z.number().finite(),
        }),
    ),
    roundStats: z.object({
        won: z.number().finite(),
        played: z.number().finite(),
    }),
    overtimes: z.number().finite(),
}) satisfies z.ZodType<TeamStatRecord>;

export type InteractionData<TData extends DataT> = {
    xPos: number;
    yPos: number;
} & TData;
export interface DataT {
    rowKey: string;
    colKey: string;
    value: number;
}
export interface ExtraLabels<TKey> {
    key: keyof TKey;
    name: string;
}
export interface TeamIdentifiers {
    teamId: number;
    teamName: string;
}

export interface TeamHeadToHead {
    winnerId: number;
    winnerName: string;
    roundDiff: number;
}

export interface PlayoffChecklistStep {
    name: string;
    description: string;
}

export interface TeamH2HOverall {
    teamId: number;
    roundDiff: number;
    mapDiff: number;
}
export const Head2HeadCheckboxRoles = ["left", "tied", "right"] as const;
export type Head2HeadCheckboxRolesT = (typeof Head2HeadCheckboxRoles)[number];
export type Head2HeadChecklistResult = Head2HeadCheckboxRolesT | false;
export interface PlayerMatchStatRecord {
    id: number;
    matchId: number | null;
    playerAgentId: number | null;
    matchPlace: number;
    playerKills: number;
    playerDeaths: number;
    playerAssists: number;
    matchRel: {
        roundCountA: number;
        roundCountB: number;
    };
    agentPlayedByPlayerRel: {
        id: number;
        name: (typeof agentNameEnum)[number];
        agentType: (typeof agentTypeEnum)[number];
    };
}
export interface PlayerRow {
    id: number;
    name: string;
    teamId: number | null;
    playerMatchesRel: PlayerMatchStatRecord[];
}
export interface CalculatedKdStats {
    gamesPlayed: number;
    kdRatio: {
        overall: number;
        min: number;
        max: number;
    };
    roundsPlayed: number;
    totalKills: number;
    totalDeaths: number;
    totalAssists: number;
}
export type agentNameEnumT = (typeof agentNameEnum)[number];
export type AgentMapType = Partial<Record<agentNameEnumT, number>>;
