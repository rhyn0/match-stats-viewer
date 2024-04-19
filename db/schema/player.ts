/** Specifics about player performance in the tournament. */

import {
    integer,
    pgTable,
    serial,
    uniqueIndex,
    varchar,
} from "drizzle-orm/pg-core";

export const players = pgTable(
    "players",
    {
        id: serial("id").primaryKey(),
        teamId: integer("team_id"), // if its null they are a sub
        name: varchar("player_name").notNull(),
    },
    (players) => {
        return {
            nameIndex: uniqueIndex("player_name_uniq_idx").on(players.name),
        };
    },
);
