import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";
import * as dotenv from "dotenv";
dotenv.config({ path: "./.env.local" });
export const env = createEnv({
    server: {
        SQLITE_DATABASE_URL: z.string().url(),
        SQLITE_DATABASE_AUTH_TOKEN: z.string().min(1),
    },
    // For Next.js >= 13.4.4, you only need to destructure client variables:
    // experimental__runtimeEnv: {
    //   NEXT_PUBLIC_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_PUBLISHABLE_KEY,
    // }
    experimental__runtimeEnv: {},
});
