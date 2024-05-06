import { PlayoffChecklistStep } from "@/types";

export const heatmapStrings = {
    team: {
        title: "Team Map Win Rate",
        description: "Heatmap of win rate percentages per map by team",
    },
    player: {
        title: "Player on Agent Play Rate",
        description: "Heatmap of play rate percentages per agent by player.",
    },
} as const;

// Head 2 Head is determined in the following order, first non-equal point gives a winner:
// - Head-to-head Map differential
// - Head-to-head Round differential
// - Map differential
// - Round differential
export const twoWaySteps: PlayoffChecklistStep[] = [
    {
        name: "Head-To-Head Map Differential",
        description: "Map differential between the two tied teams",
    },
    {
        name: "Head-To-Head Round Differential",
        description: "Round differential between the two tied teams",
    },
    {
        name: "Overall Map Differential",
        description:
            "Map differential between of each team against all other opponents excluding the tied team.",
    },
    {
        name: "Overall Round Differential",
        description:
            "Round differential between of each team against all other opponents excluding the tied team.",
    },
];
