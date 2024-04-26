import { kdaRegex, roundCountRegex } from "@/types";

export function parseRoundCount(rawRounds: string): [number, number] {
    const roundMatch = rawRounds.match(roundCountRegex);
    // match includes the full match, not just groups
    if (!roundMatch || roundMatch.length !== 3) {
        throw new Error(`Failed to parse for round count from: ${rawRounds}`);
    }
    return roundMatch.map((val) => parseInt(val)) as [number, number];
}

export function parseKda(rawKda: string): [number, number, number] {
    const kdaMatch = rawKda.match(kdaRegex);
    // match includes the full match, not just groups
    if (!kdaMatch || kdaMatch.length !== 4) {
        throw new Error(`Failed to parse KDA string from: ${rawKda}`);
    }
    return kdaMatch.map((val) => parseInt(val)) as [number, number, number];
}
