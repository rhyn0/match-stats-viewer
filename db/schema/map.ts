/** Final Statistics that are relevant to the Maps available for this tournament. */

import { sqliteTable, integer, unique, text } from "drizzle-orm/sqlite-core";

export const maps = sqliteTable(
    "maps",
    {
        id: integer("id", { mode: "number" }).primaryKey({
            autoIncrement: true,
        }),
        name: text("map_name").notNull(),
    },
    (maps) => {
        return {
            mapNameIdx: unique("map_name_uniq_idx").on(maps.name),
        };
    },
);
