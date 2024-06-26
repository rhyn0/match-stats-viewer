/** This is the raw input of matches for the tournament. */

import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";

import { teams } from "./team";
import { maps } from "./map";
import { relations, sql } from "drizzle-orm";
import { playerMatches } from "./playerMatch";

export const matches = sqliteTable("matches_played", {
    id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
    teamAName: text("team_a_name", { length: 256 }),
    teamA: integer("team_a_id")
        .references(() => teams.id)
        .notNull(),
    teamBName: text("team_b_name", { length: 256 }),
    teamB: integer("team_b_id")
        .references(() => teams.id)
        .notNull(),
    rawRoundCount: text("raw_rounds", { length: 5 }).notNull(),
    roundCountA: integer("rounds_for_a").notNull(),
    roundCountB: integer("rounds_for_b").notNull(),
    playDate: integer("match_date", { mode: "timestamp" })
        .default(sql`CURRENT_TIMESTAMP`)
        .notNull(),
    mapPlayedId: integer("map_id")
        .references(() => maps.id)
        .notNull(),
    isPlayoffs: integer("is_playoffs", { mode: "boolean" })
        .notNull()
        .default(false),
});

export const playerDetailsRel = relations(matches, ({ many }) => ({
    playerDetailsRel: many(playerMatches),
}));

export const teamDetailsRel = relations(matches, ({ one }) => ({
    teamDetailsARel: one(teams, {
        fields: [matches.teamA],
        references: [teams.id],
        relationName: "teamDetailsARel",
    }),
    teamDetailsBRel: one(teams, {
        fields: [matches.teamB],
        references: [teams.id],
        relationName: "teamDetailsBRel",
    }),
}));

export const mapForMatchRel = relations(matches, ({ one }) => ({
    mapForMatchRel: one(maps, {
        fields: [matches.mapPlayedId],
        references: [maps.id],
    }),
}));
