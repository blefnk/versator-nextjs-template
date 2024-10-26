import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

config({ path: ".env" });

const dbPrefix = process.env.NEXT_PUBLIC_DATABASE_PREFIX || "relivator";

export default defineConfig({
  dbCredentials: {
    url: process.env.DATABASE_URL || "",
  },
  dialect: "postgresql",
  migrations: {
    schema: "public",
    table: `drizzle/${dbPrefix}/pgsql`,
  },
  out: `drizzle/${dbPrefix}/pgsql`,
  schema: "src/db/schema/index.ts",
  strict: true,
  tablesFilter: [`${dbPrefix}_*`],
  verbose: false,
});
