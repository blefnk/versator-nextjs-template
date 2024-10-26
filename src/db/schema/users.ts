import {
  integer,
  pgEnum,
  pgTableCreator,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { databasePrefix } from "../utils";
import { generateIdByTableName } from "~/lib/id";
import { InferSelectModel, relations, sql } from "drizzle-orm";
import { carts } from "./carts";
import { products } from "./products";
import { stores } from "./stores";
import { lifecycleDates } from "./utils";

export const createTable = pgTableCreator(
  (name) => `${databasePrefix}_${name}`,
);

export const modeEnum = pgEnum("mode", ["buyer", "seller"]);

export const roleEnum = pgEnum("role", ["user", "admin"]);

export const statusEnum = pgEnum("status", [
  "guest",
  "idle",
  "invisible",
  "no-disturb",
  "offline",
  "online",
]);

export const users = createTable("user", {
  id: varchar("id", { length: 30 })
    .$defaultFn(() => generateIdByTableName("user"))
    .primaryKey()
    .notNull(),
  name: text("name").notNull(),
  age: integer("age").notNull(),
  currentCartId: text("currentCartId"),
  email: text("email").notNull().unique(),
  emailVerified: timestamp("emailVerified", {
    mode: "date",
  }).default(sql`CURRENT_TIMESTAMP`),
  hashedPassword: text("hashedPassword"),
  image: text("image"),
  mode: modeEnum("mode").default("buyer"),
  role: roleEnum("role").default("user"),
  status: statusEnum("status").default("offline"),
  stripeCurrentPeriodEnd: text("stripeCurrentPeriodEnd"),
  stripeCustomerId: text("stripeCustomerId"),
  stripePriceId: text("stripePriceId"),
  stripeSubscriptionId: text("stripeSubscriptionId"),
  ...lifecycleDates,
});

export type User = InferSelectModel<typeof users>;

export const usersRelations = relations(users, ({ many }) => ({
  carts: many(carts),
  products: many(products),
  stores: many(stores),
}));
