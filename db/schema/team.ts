/** Information regarding the teams, this will have id references to `players` */

import { relations } from "drizzle-orm";
import { pgTable, serial, timestamp, varchar } from "drizzle-orm/pg-core";
import { players } from "./player";

export const teams = pgTable("participating_teams", {
    id: serial("id").primaryKey(),
    defaultName: varchar("default_name").notNull(),
    teamName: varchar("team_name"),
    // TODO: default of modifiedAt to be now?
    modifiedAt: timestamp("modified_at", {
        mode: "date",
        withTimezone: true,
    }).$onUpdateFn(() => new Date()),
});

export const teamPlayersRel = relations(teams, ({ many }) => ({
    teamPlayersRel: many(players),
}));
