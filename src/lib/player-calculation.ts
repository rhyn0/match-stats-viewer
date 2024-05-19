import {
    PlayerRow,
    CalculatedKdStats,
    AgentMapType,
    agentNameEnumT,
    PlayerMatchStatRecord,
} from "@/types";
import { calculateKd } from "./kdCalculation";

export function calculateStats(row: PlayerRow): CalculatedKdStats {
    const defaultRecord = {
        totalKills: 0,
        totalDeaths: 0,
        totalAssists: 0,
        roundsPlayed: 0,
        kdRatio: {
            min: Number.POSITIVE_INFINITY,
            max: Number.NEGATIVE_INFINITY,
        },
    };
    const { totalKills, totalDeaths, totalAssists, kdRatio, roundsPlayed } =
        row.playerMatchesRel.reduce(
            (
                {
                    totalKills,
                    totalDeaths,
                    totalAssists,
                    kdRatio,
                    roundsPlayed,
                },
                matchRecord,
            ) => {
                const matchKdRatio = calculateKd({
                    kills: matchRecord.playerKills,
                    deaths: matchRecord.playerDeaths,
                });
                const kdMin = Math.min(kdRatio.min, matchKdRatio);
                const kdMax = Math.max(kdRatio.max, matchKdRatio);
                return {
                    totalKills: totalKills + matchRecord.playerKills,
                    totalDeaths: totalDeaths + matchRecord.playerDeaths,
                    totalAssists: totalAssists + matchRecord.playerAssists,
                    roundsPlayed:
                        roundsPlayed +
                        matchRecord.matchRel.roundCountA +
                        matchRecord.matchRel.roundCountB,
                    kdRatio: {
                        min: kdMin,
                        max: kdMax,
                    },
                };
            },
            defaultRecord,
        );
    const returnData = {
        totalKills,
        totalDeaths,
        totalAssists,
        roundsPlayed,
        kdRatio: {
            ...kdRatio,
            overall: calculateKd({ kills: totalKills, deaths: totalDeaths }),
        },
        gamesPlayed: row.playerMatchesRel.length,
    };
    return returnData;
}
export function calculateAgentsPlayed(
    row: PlayerMatchStatRecord[],
): AgentMapType {
    const agentMap = new Map<agentNameEnumT, number>();
    for (const matchRecord of row) {
        const existingValue =
            agentMap.get(
                matchRecord.agentPlayedByPlayerRel.name as agentNameEnumT,
            ) ?? 0;
        agentMap.set(
            matchRecord.agentPlayedByPlayerRel.name as agentNameEnumT,
            existingValue + 1,
        );
    }
    return Object.fromEntries(agentMap.entries()) as AgentMapType;
}
