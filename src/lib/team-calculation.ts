import { TeamDataT, TeamStatRecord, mapNames, mapStats } from "@/types";
import { TeamRow } from "@/types";
import { handleDivZero } from "./statsParse";

export function calculateTeamStats(
    teamRow: TeamRow,
): Omit<TeamStatRecord, "teamName" | "defaultName"> {
    const mapsPlayed =
        teamRow.matchesForTeamARel.length + teamRow.matchesForTeamBRel.length;
    const roundStats: { won: number; played: number } = { won: 0, played: 0 };
    let overtimes = 0;
    const runningStats = new Map();
    for (const aRecord of teamRow.matchesForTeamARel) {
        const prevValue: mapStats = runningStats.get(
            aRecord.mapForMatchRel.name,
        ) ?? { played: 0, won: 0 };
        prevValue.played += 1;
        if (aRecord.roundCountA > aRecord.roundCountB) {
            prevValue.won += 1;
        }
        runningStats.set(aRecord.mapForMatchRel.name, prevValue);
        // determine overtime
        if (aRecord.roundCountA + aRecord.roundCountB > 24) {
            overtimes += 1;
        }
        roundStats.won += aRecord.roundCountA;
        roundStats.played += aRecord.roundCountA + aRecord.roundCountB;
    }

    for (const bRecord of teamRow.matchesForTeamBRel) {
        const prevValue: mapStats = runningStats.get(
            bRecord.mapForMatchRel.name,
        ) ?? { played: 0, won: 0 };
        prevValue.played += 1;
        if (bRecord.roundCountA < bRecord.roundCountB) {
            prevValue.won += 1;
        }
        runningStats.set(bRecord.mapForMatchRel.name, prevValue);
        // determine overtime
        if (bRecord.roundCountA + bRecord.roundCountB > 24) {
            overtimes += 1;
        }
        roundStats.won += bRecord.roundCountB;
        roundStats.played += bRecord.roundCountA + bRecord.roundCountB;
    }

    return {
        overtimes,
        roundStats,
        mapStats: Object.fromEntries(runningStats.entries()),
        mapsPlayed,
    };
}
export function formatTeamDataForMap(
    data: TeamStatRecord[] | undefined,
): TeamDataT[] {
    if (!data) return [];

    const result = data.flatMap((team) =>
        mapNames.map((mapName) => {
            const mapStats = team.mapStats[mapName] ?? { played: 0, won: 0 };
            return {
                rowKey: team.teamName ?? team.defaultName,
                colKey: mapName,
                value:
                    mapStats.played === 0
                        ? -1
                        : parseFloat(
                              handleDivZero({
                                  wins: mapStats.won,
                                  plays: mapStats.played,
                              }).toFixed(3),
                          ),
                wins: mapStats.won,
                plays: mapStats.played,
            };
        }),
    );
    return result;
}
