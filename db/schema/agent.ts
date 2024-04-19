/** Statistics about each agent's performance in the tournament. */

import {
    pgEnum,
    pgTable,
    serial,
    uniqueIndex,
    varchar,
} from "drizzle-orm/pg-core";

export const agentTypeEnum = pgEnum("agent_types", [
    "controller",
    "sentinel",
    "duelist",
    "initiator",
]);

export const agents = pgTable(
    "agents",
    {
        id: serial("id").primaryKey(),
        name: varchar("agent_name").notNull(),
        agentType: agentTypeEnum("agent_type"),
    },
    (agents) => {
        return {
            agentNameIdx: uniqueIndex("agent_name_uniq_idx").on(agents.name),
        };
    },
);
