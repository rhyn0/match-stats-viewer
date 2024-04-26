/** Statistics about each agent's performance in the tournament. */

import { sqliteTable, integer, unique, text } from "drizzle-orm/sqlite-core";

export const agentTypeEnum = [
    "controller",
    "sentinel",
    "duelist",
    "initiator",
] as const;
export const agentNameEnum = [
    "Astra",
    "Breach",
    "Brimstone",
    "Chamber",
    "Clove",
    "Cypher",
    "Deadlock",
    "Fade",
    "Gekko",
    "Harbor",
    "Iso",
    "Jett",
    "Kayo",
    "Killjoy",
    "Neon",
    "Omen",
    "Phoenix",
    "Raze",
    "Reyna",
    "Sage",
    "Skye",
    "Sova",
    "Viper",
    "Yoru",
] as const;

export type agentType = (typeof agentTypeEnum)[keyof typeof agentTypeEnum];
export type agentName = (typeof agentNameEnum)[keyof typeof agentNameEnum];

export const agents = sqliteTable(
    "agents",
    {
        id: integer("id", { mode: "number" }).primaryKey({
            autoIncrement: true,
        }),
        name: text("agent_name").notNull(),
        agentType: text("agent_type", {
            // type hint to ourselves that the possible expected values
            // no checking
            enum: agentTypeEnum,
        }),
    },
    (agents) => {
        return {
            agentNameIdx: unique("agent_name_uniq_idx").on(agents.name),
        };
    },
);
