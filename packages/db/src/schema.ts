import { relations } from "drizzle-orm";
import { text, sqliteTable } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";

export const users = sqliteTable('users', {
  id: text('id').primaryKey().unique(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  phone: text('phone_number').notNull().unique(),
  role: text('role', {enum: ["SALES", "LOGISTICS", "MANAGEMENT", "ADMIN"]}).notNull(),
  teamId: text('team_id').notNull().references(() => teams.id),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

export const insertUserSchema = createInsertSchema(users)

export const usersRelations = relations(users, ({ one }) => ({
    teamId: one(teams, {
        fields: [users.teamId],
        references: [teams.id]
    }),
}));

export const teams = sqliteTable('teams', {
    id: text('id').primaryKey().unique(),
    name: text('name').notNull(),
    type: text('type', {enum: ["CLIENT", "SELLER"]}).notNull(),
    createdAt: text('created_at').notNull(),
    updatedAt: text('updated_at').notNull(),
    gstNo: text('gst_no').notNull().unique(),
    address: text('address').notNull(),
});

export const teamsRelations = relations(teams, ({ many }) => ({
    pocId: many(users),
}));
