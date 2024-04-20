import { drizzle } from "drizzle-orm/postgres-js";
import schema from "@db/schema";
import postgres from "postgres";
import { env } from "@/env";

const queryClient = postgres(env.POSTGRES_URL);
const db = drizzle(queryClient, { schema });
export default db;
