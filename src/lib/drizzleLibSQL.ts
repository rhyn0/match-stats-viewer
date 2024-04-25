import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import schema from "@db/schema";

import { env } from "@/env";

const queryClient = createClient({
    url: env.SQLITE_DATABASE_URL,
    authToken: env.SQLITE_DATABASE_AUTH_TOKEN,
});
const db = drizzle(queryClient, { schema });
export default db;
