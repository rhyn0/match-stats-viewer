/** Information regarding the teams, this will have id references to `players` */

import { pgTable, serial, timestamp, varchar } from "drizzle-orm/pg-core";

export const teams = pgTable("participating_teams", {
    id: serial("id").primaryKey(),
    defaultName: varchar("default_name").notNull(),
    teamName: varchar("team_name"),
    modifiedAt: timestamp("modified_at", {
        mode: "date",
        withTimezone: true,
    }).$onUpdateFn(() => new Date()),
});
