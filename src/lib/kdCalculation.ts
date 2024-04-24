export function calculateKd({
    kills,
    deaths,
}: {
    kills: number;
    deaths: number;
}): number {
    if (deaths === 0) {
        return kills;
    } else {
        return kills / deaths;
    }
}
