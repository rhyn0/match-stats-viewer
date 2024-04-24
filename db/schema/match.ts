/** This is the raw input of matches for the tournament. */

import { integer, pgTable, serial, varchar, date } from "drizzle-orm/pg-core";

import { teams } from "./team";
import { maps } from "./map";
import { relations } from "drizzle-orm";
import { playerMatches } from "./playerMatch";

export const matches = pgTable("matches_played", {
    id: serial("id").primaryKey(),
    teamAName: varchar("team_a_name", { length: 256 }),
    teamA: integer("team_a_id")
        .references(() => teams.id)
        .notNull(),
    teamBName: varchar("team_b_name", { length: 256 }),
    teamB: integer("team_b_id")
        .references(() => teams.id)
        .notNull(),
    rawRoundCount: varchar("raw_rounds", { length: 5 }).notNull(),
    roundCountA: integer("rounds_for_a").notNull(),
    roundCountB: integer("rounds_for_b").notNull(),
    playDate: date("match_date", { mode: "date" }).defaultNow().notNull(),
    mapPlayedId: integer("map_id")
        .references(() => maps.id)
        .notNull(),
});

export const playerDetailsRel = relations(matches, ({ many }) => ({
    playerDetailsRel: many(playerMatches),
}));
