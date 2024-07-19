import type { InferSelectModel } from "drizzle-orm";
import { relations } from "drizzle-orm";
import { text, sqliteTable } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
import { sql } from "drizzle-orm";

export const users = sqliteTable("users", {
  id: text("id").primaryKey().unique(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  phone: text("phone_number").notNull().unique(),
  role: text("role", {
    enum: ["SALES", "LOGISTICS", "MANAGEMENT", "ADMIN"],
  }).notNull(),
  teamId: text("team_id")
    .notNull()
    .references(() => teams.id),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

export const insertUserSchema = createInsertSchema(users);

export type UserWithTeam = InferSelectModel<typeof users> & {
  team: InferSelectModel<typeof teams>;
};

export const usersRelations = relations(users, ({ one, many }) => ({
  team: one(teams, {
    fields: [users.teamId],
    references: [teams.id],
  }),
  notifications: many(notifications),
}));

export const teams = sqliteTable("teams", {
  id: text("id").primaryKey().unique(),
  name: text("name").notNull(),
  type: text("type", { enum: ["CLIENT", "SELLER"] }).notNull(),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
  gstNo: text("gst_no").unique(),
  address: text("address").notNull(),
});

export type Team = InferSelectModel<typeof teams>;

export const insertTeamSchema = createInsertSchema(teams);

export const teamsRelations = relations(teams, ({ many }) => ({
  poc: many(users),
}));

export const products = sqliteTable("products", {
  id: text("id").primaryKey().unique(),
  name: text("name").notNull(),
  make: text("make").notNull(),
  cas: text("cas").notNull(),
  desc: text("desc").notNull(),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

export type Product = InferSelectModel<typeof products>;

export const insertProductSchema = createInsertSchema(products);

export const notifications = sqliteTable("notifications", {
  id: text("id").primaryKey().unique(),
  referenceId: text("reference_id").notNull(),
  readStatus: text("read_status", {
    enum: ["UNREAD", "READ"],
  }).notNull(),
  notificationType: text("notification_type", {
    enum: [
      "ORDER_PLACED",
      "NEW_QUOTE_RECIEVED",
      "QUOTE_ACCEPTED",
      "QUOTE_EXPIRED",
      "ORDER_ACCEPTED",
      "ORDER_DISPATCHED",
      "ORDER_SHIPPED",
      "SAMPLE_DISPATCHED",
      "SAMPLE_SHIPPED",
      "SAMPLE_ORDER_PLACED",
      "INQUIRY_RAISED",
    ],
  }).notNull(),
  createdAt: text("notification_time").notNull(),

  // https://orm.drizzle.team/learn/guides/empty-array-default-value
  products: text("products", { mode: "json" })
    .notNull()
    .$type<string[]>()
    .default(sql`(json_array())`)
    .notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
});

export const insertNotificationSchema = createInsertSchema(notifications);

export const notificationRelations = relations(notifications, ({ one }) => ({
  user: one(users, {
    fields: [notifications.userId],
    references: [users.id],
  }),
}));

export type Notification = InferSelectModel<typeof notifications>;
