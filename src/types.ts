import { z } from "zod";
import React from "react";
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

export interface IRoundProps extends Record<string, unknown> {
    seeds: ISeedProps[];
    title: string;
}

export interface TeamInfo extends Record<string, unknown> {
    name?: string;
}

export interface ISeedProps extends Record<string, unknown> {
    id: number | string;
    teams: TeamInfo[];
    date?: string;
    mobileBreakpoint?: number;
}

export interface IRenderSeedProps {
    seed: ISeedProps;
    breakpoint: number;
    roundIndex: number;
    seedIndex: number;
    rounds?: IRoundProps[];
}

export interface ISingleEliminationProps {
    // If true, the component direction will be set to RTL
    rtl?: boolean;
    // Array of rounds matching RoundProps shape,
    rounds: IRoundProps[];
    // Single round className
    roundClassName?: string;
    /** @default 992, if you don't want a mobile breakpoint, pass 0 */
    mobileBreakpoint?: number;
    // The whole bracket className
    bracketClassName?: string;
    /**
     * @param {string} title string or component passed with each round
     * @param {number} round the current round index
     */
    roundTitleComponent?: (
        // eslint-disable-next-line no-unused-vars
        title: string | JSX.Element,
        // eslint-disable-next-line no-unused-vars
        roundIdx: number,
    ) => JSX.Element;
    /**
     * @param {object} seed the current seed
     * @param {number} breakpoint the breakpoint used to determine responsive size
     * @param {number} roundIdx the current round index
     */
    renderSeedComponent?: React.FC<IRenderSeedProps>;
}
