/** Final Statistics that are relevant to the Maps available for this tournament. */

import { pgTable, serial, uniqueIndex, varchar } from "drizzle-orm/pg-core";

export const maps = pgTable(
    "maps",
    {
        id: serial("id").primaryKey(),
        name: varchar("map_name").notNull(),
    },
    (maps) => {
        return {
            mapNameIdx: uniqueIndex("map_name_uniq_idx").on(maps.name),
        };
    },
);
