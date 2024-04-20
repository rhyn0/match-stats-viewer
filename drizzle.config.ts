import { defineConfig } from "drizzle-kit";
import { env } from "@/env";
export default defineConfig({
    schema: "./db/schema/*",
    driver: "pg",
    dbCredentials: {
        connectionString: env.POSTGRES_URL,
    },
    verbose: true,
    strict: true,
    out: "./db/migrations",
});
