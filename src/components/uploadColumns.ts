import { ColumnDef } from "@tanstack/react-table";
import { z } from "zod";
import { agentNameEnum } from "@db/schema/agent";
import { roundCountRegex } from "@/types";
import { kdaRegex } from "@/types";

const agentEnumZ = z.enum(agentNameEnum);
const kdaTrimRegexZ = z.string().trim().regex(kdaRegex);
const playerNameZ = z.string().min(1);

export const MatchDataZ = z.object({
    team_name_a: z.string().min(1, {
        message: "Default name (the number)",
    }),
    team_name_b: z.string().min(1, {
        message: "Default name (the number)",
    }),
    match_date: z.coerce.date(),
    map_name: z.string().trim().min(1),
    round_count: z.string().trim().regex(roundCountRegex),
    player_1_kda: kdaTrimRegexZ,
    player_1_agent: agentEnumZ,
    player_1_name: playerNameZ,
    player_2_kda: kdaTrimRegexZ,
    player_2_agent: agentEnumZ,
    player_2_name: playerNameZ,
    player_3_kda: kdaTrimRegexZ,
    player_3_agent: agentEnumZ,
    player_3_name: playerNameZ,
    player_4_kda: kdaTrimRegexZ,
    player_4_agent: agentEnumZ,
    player_4_name: playerNameZ,
    player_5_kda: kdaTrimRegexZ,
    player_5_agent: agentEnumZ,
    player_5_name: playerNameZ,
    player_6_kda: kdaTrimRegexZ,
    player_6_agent: agentEnumZ,
    player_6_name: playerNameZ,
    player_7_kda: kdaTrimRegexZ,
    player_7_agent: agentEnumZ,
    player_7_name: playerNameZ,
    player_8_kda: kdaTrimRegexZ,
    player_8_agent: agentEnumZ,
    player_8_name: playerNameZ,
    player_9_kda: kdaTrimRegexZ,
    player_9_agent: agentEnumZ,
    player_9_name: playerNameZ,
    player_10_kda: kdaTrimRegexZ,
    player_10_agent: agentEnumZ,
    player_10_name: playerNameZ,
});

export type MatchData = z.infer<typeof MatchDataZ>;

export const columns: ColumnDef<MatchData>[] = [
    {
        id: "teamInfo",
        header: "Team Information",
        columns: [
            {
                accessorKey: "team_name_a",
                header: "Team Name A",
                meta: {
                    filterVariant: "select",
                },
            },
            {
                accessorKey: "team_name_b",
                header: "Team Name B",
                meta: {
                    filterVariant: "select",
                },
            },
        ],
    },
    {
        id: "mapInfo",
        header: "Map Information",
        columns: [
            {
                accessorKey: "map_name",
                header: "Map Name",
                meta: {
                    filterVariant: "select",
                },
            },
            {
                accessorKey: "round_count",
                header: "Round Count",
                enableColumnFilter: false,
            },
        ],
    },
    {
        id: "player1",
        header: "Player 1",
        columns: [
            {
                accessorKey: "player_1_kda",
                header: "KDA",
                enableColumnFilter: false,
            },
            {
                accessorKey: "player_1_agent",
                header: "Agent",
                meta: {
                    filterVariant: "select",
                },
            },
            {
                accessorKey: "player_1_name",
                header: "Name",
                meta: {
                    filterVariant: "select",
                },
            },
        ],
    },
    {
        id: "player2",
        header: "Player 2",
        columns: [
            {
                accessorKey: "player_2_kda",
                header: "KDA",
                enableColumnFilter: false,
            },
            {
                accessorKey: "player_2_agent",
                header: "Agent",
                meta: {
                    filterVariant: "select",
                },
            },
            {
                accessorKey: "player_2_name",
                header: "Name",
                meta: {
                    filterVariant: "select",
                },
            },
        ],
    },
    {
        id: "player3",
        header: "Player 3",
        columns: [
            {
                accessorKey: "player_3_kda",
                header: "KDA",
                enableColumnFilter: false,
            },
            {
                accessorKey: "player_3_agent",
                header: "Agent",
                meta: {
                    filterVariant: "select",
                },
            },
            {
                accessorKey: "player_3_name",
                header: "Name",
                meta: {
                    filterVariant: "select",
                },
            },
        ],
    },
    {
        id: "player4",
        header: "Player 4",
        columns: [
            {
                accessorKey: "player_4_kda",
                header: "KDA",
                enableColumnFilter: false,
            },
            {
                accessorKey: "player_4_agent",
                header: "Agent",
                meta: {
                    filterVariant: "select",
                },
            },
            {
                accessorKey: "player_4_name",
                header: "Name",
                meta: {
                    filterVariant: "select",
                },
            },
        ],
    },
    {
        id: "player5",
        header: "Player 5",
        columns: [
            {
                accessorKey: "player_5_kda",
                header: "KDA",
                enableColumnFilter: false,
            },
            {
                accessorKey: "player_5_agent",
                header: "Agent",
                meta: {
                    filterVariant: "select",
                },
            },
            {
                accessorKey: "player_5_name",
                header: "Name",
                meta: {
                    filterVariant: "select",
                },
            },
        ],
    },
    {
        id: "player6",
        header: "Player 6",
        columns: [
            {
                accessorKey: "player_6_kda",
                header: "KDA",
                enableColumnFilter: false,
            },
            {
                accessorKey: "player_6_agent",
                header: "Agent",
                meta: {
                    filterVariant: "select",
                },
            },
            {
                accessorKey: "player_6_name",
                header: "Name",
                meta: {
                    filterVariant: "select",
                },
            },
        ],
    },
    {
        id: "player7",
        header: "Player 7",
        columns: [
            {
                accessorKey: "player_7_kda",
                header: "KDA",
                enableColumnFilter: false,
            },
            {
                accessorKey: "player_7_agent",
                header: "Agent",
                meta: {
                    filterVariant: "select",
                },
            },
            {
                accessorKey: "player_7_name",
                header: "Name",
                meta: {
                    filterVariant: "select",
                },
            },
        ],
    },
    {
        id: "player8",
        header: "Player 8",
        columns: [
            {
                accessorKey: "player_8_kda",
                header: "KDA",
                enableColumnFilter: false,
            },
            {
                accessorKey: "player_8_agent",
                header: "Agent",
                meta: {
                    filterVariant: "select",
                },
            },
            {
                accessorKey: "player_8_name",
                header: "Name",
                meta: {
                    filterVariant: "select",
                },
            },
        ],
    },
    {
        id: "player9",
        header: "Player 9",
        columns: [
            {
                accessorKey: "player_9_kda",
                header: "KDA",
                enableColumnFilter: false,
            },
            {
                accessorKey: "player_9_agent",
                header: "Agent",
                meta: {
                    filterVariant: "select",
                },
            },
            {
                accessorKey: "player_9_name",
                header: "Name",
                meta: {
                    filterVariant: "select",
                },
            },
        ],
    },
    {
        id: "player10",
        header: "Player 10",
        columns: [
            {
                accessorKey: "player_10_kda",
                header: "KDA",
                enableColumnFilter: false,
            },
            {
                accessorKey: "player_10_agent",
                header: "Agent",
                meta: {
                    filterVariant: "select",
                },
            },
            {
                accessorKey: "player_10_name",
                header: "Name",
                meta: {
                    filterVariant: "select",
                },
            },
        ],
    },
];
