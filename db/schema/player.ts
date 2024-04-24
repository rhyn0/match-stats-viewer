/** Specifics about player performance in the tournament. */

import { relations } from "drizzle-orm";
import {
    integer,
    pgTable,
    serial,
    uniqueIndex,
    varchar,
} from "drizzle-orm/pg-core";
import { playerMatches } from "./playerMatch";
import { teams } from "./team";

export const players = pgTable(
    "players",
    {
        id: serial("id").primaryKey(),
        // TODO: make this a FK
        teamId: integer("team_id"), // if its null they are a sub
        name: varchar("player_name").notNull(),
    },
    (players) => {
        return {
            nameIndex: uniqueIndex("player_name_uniq_idx").on(players.name),
        };
    },
);

export const playersMatchRel = relations(players, ({ many }) => ({
    playerMatchesRel: many(playerMatches),
}));

export const teamInfoRel = relations(players, ({ one }) => ({
    teamInfoRel: one(teams, {
        fields: [players.teamId],
        references: [teams.id],
    }),
}));
