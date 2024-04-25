import { defineConfig } from "drizzle-kit";
import { env } from "@/env";
export default defineConfig({
    schema: "./db/schema/*",
    driver: "turso",
    dbCredentials: {
        url: env.SQLITE_DATABASE_URL,
        authToken: env.SQLITE_DATABASE_AUTH_TOKEN,
    },
    verbose: true,
    strict: true,
    out: "./db/migrations",
});
