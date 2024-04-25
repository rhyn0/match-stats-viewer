/** This table defines a singular player in a match and any statistics we want to associate with this occurrence of gameplay. */

import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";
import { relations } from "drizzle-orm";

import { matches } from "./match";
import { agents } from "./agent";
import { players } from "./player";

export const playerMatches = sqliteTable("player_matches", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    playerId: integer("player_id").references(() => players.id),
    matchId: integer("match_id").references(() => matches.id),
    playerAgentId: integer("agent_id").references(() => agents.id),
    matchPlace: integer("match_place").notNull(),
    rawKDA: text("raw_kda", { length: 10 }).notNull(),
    playerKills: integer("player_kills").notNull(),
    playerDeaths: integer("player_deaths").notNull(),
    playerAssists: integer("player_assists").notNull(),
});

export const playerWhoPlayedRel = relations(playerMatches, ({ one }) => ({
    playerWhoPlayedRel: one(players, {
        fields: [playerMatches.playerId],
        references: [players.id],
    }),
}));

export const matchRel = relations(playerMatches, ({ one }) => ({
    matchRel: one(matches, {
        fields: [playerMatches.matchId],
        references: [matches.id],
    }),
}));
