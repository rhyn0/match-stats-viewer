/** Information regarding the teams, this will have id references to `players` */

import { relations, sql } from "drizzle-orm";
import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";
import { players } from "./player";

export const teams = sqliteTable("participating_teams", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    defaultName: text("default_name").notNull(),
    teamName: text("team_name"),
    // TODO: default of modifiedAt to be now?
    modifiedAt: integer("modified_at", {
        mode: "timestamp",
    })
        .default(sql`CURRENT_TIMESTAMP`)
        .$onUpdateFn(() => new Date()),
});

export const teamPlayersRel = relations(teams, ({ many }) => ({
    teamPlayersRel: many(players),
}));
