/** Specifics about player performance in the tournament. */

import { relations } from "drizzle-orm";

import { sqliteTable, integer, unique, text } from "drizzle-orm/sqlite-core";
import { playerMatches } from "./playerMatch";
import { teams } from "./team";

export const players = sqliteTable(
    "players",
    {
        id: integer("id", { mode: "number" }).primaryKey({
            autoIncrement: true,
        }),
        teamId: integer("team_id").references(() => teams.id), // if its null they are a sub
        name: text("player_name").notNull(),
    },
    (players) => {
        return {
            nameIndex: unique("player_name_uniq_idx").on(players.name),
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
        relationName: "teamInfoRel",
    }),
}));
