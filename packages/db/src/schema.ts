import type { InferSelectModel } from "drizzle-orm";
import { relations } from "drizzle-orm";
import {
  text,
  sqliteTable,
  integer,
  primaryKey,
  real,
} from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";

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
  devices: many(devices),
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
  searchName: text("search_name").notNull(),
  searchMake: text("search_make").notNull(),
  searchCas: text("search_cas").notNull(),
  searchDesc: text("search_desc").notNull(),
});

export type Product = InferSelectModel<typeof products>;

export const insertProductSchema = createInsertSchema(products);

export const inquiries = sqliteTable("inquiries", {
  id: text("id").primaryKey().unique(),
  status: text("status", {
    enum: ["RAISED", "NEGOTIATING", "ACCEPTED", "REJECTED"],
  }).notNull(),
  tnc: text("tnc").notNull(),
  remarks: text("remarks"),
  buyerId: text("buyer_id")
    .notNull()
    .references(() => teams.id),
  sellerId: text("seller_id")
    .notNull()
    .references(() => teams.id),
  createdAt: text("created_at")
    .$defaultFn(() => new Date().toISOString())
    .notNull(),
  updatedAt: text("updated_at")
    .$defaultFn(() => new Date().toISOString())
    .notNull(),
  productNames: text("product_names").notNull(),
  searchQuery: text("search_query").notNull().default(""),
});

export type Inquiry = InferSelectModel<typeof inquiries>;

export const insertInquirySchema = createInsertSchema(inquiries);

export const inquiriesRelations = relations(inquiries, ({ one, many }) => ({
  buyer: one(teams, {
    fields: [inquiries.buyerId],
    references: [teams.id],
  }),
  seller: one(teams, {
    fields: [inquiries.sellerId],
    references: [teams.id],
  }),
  quotes: many(quotes),
}));

export const quotes = sqliteTable("quotes", {
  id: text("id").primaryKey().unique(),
  status: text("status", {
    enum: ["REQUESTED", "NEGOTIATING", "ACCEPTED", "REJECTED", "STALE"],
  }).notNull(),
  inquiryId: text("inquiry_id")
    .notNull()
    .references(() => inquiries.id),
  createdBy: text("created_by")
    .notNull()
    .references(() => users.id),
  createdByTeam: text("created_by_team")
    .notNull()
    .references(() => teams.id),
  createdAt: text("created_at")
    .$defaultFn(() => new Date().toISOString())
    .notNull(),
  updatedAt: text("updated_at")
    .$defaultFn(() => new Date().toISOString())
    .notNull(),
});

export type Quote = InferSelectModel<typeof quotes>;

export const insertQuoteSchema = createInsertSchema(quotes);

export const quoteItems = sqliteTable(
  "quote_items",
  {
    quoteId: text("quote_id")
      .notNull()
      .references(() => quotes.id),
    productId: text("product_id")
      .notNull()
      .references(() => products.id),
    price: real("price").notNull(),
    quantity: real("quantity").notNull(),
    unit: text("unit").notNull(),
    prevPrice: real("prev_price"),
    prevQuantity: real("prev_quantity"),
    sampleRequested: integer("sample_requested", {
      mode: "boolean",
    }).notNull(),
    techDocumentRequested: integer("tech_document_requested", {
      mode: "boolean",
    }).notNull(),
    createdAt: text("created_at")
      .$defaultFn(() => new Date().toISOString())
      .notNull(),
    updatedAt: text("updated_at")
      .$defaultFn(() => new Date().toISOString())
      .notNull(),
  },
  (table) => {
    return {
      pk: primaryKey({
        columns: [table.quoteId, table.productId],
      }),
    };
  },
);

export type QuoteItem = InferSelectModel<typeof quoteItems>;

export const insertQuoteItemSchema = createInsertSchema(quoteItems);

export const quoteItemsRelations = relations(quoteItems, ({ one }) => ({
  quote: one(quotes, {
    fields: [quoteItems.quoteId],
    references: [quotes.id],
  }),
  product: one(products, {
    fields: [quoteItems.productId],
    references: [products.id],
  }),
}));

export const quotesRelations = relations(quotes, ({ one, many }) => ({
  inquiry: one(inquiries, {
    fields: [quotes.inquiryId],
    references: [inquiries.id],
  }),
  createdByUser: one(users, {
    fields: [quotes.createdBy],
    references: [users.id],
  }),
  createdByTeam: one(teams, {
    fields: [quotes.createdByTeam],
    references: [teams.id],
  }),
  quoteItems: many(quoteItems),
}));

export const productsRelations = relations(products, ({ many }) => ({
  quoteItems: many(quoteItems),
}));

export const orders = sqliteTable("orders", {
  id: text("id").primaryKey().unique(),
  status: text("status", {
    enum: ["PLACED", "DISPATCHED", "DELIVERED", "REJECTED"],
  }).notNull(),
  buyerId: text("buyer_id")
    .notNull()
    .references(() => teams.id),
  sellerId: text("seller_id")
    .notNull()
    .references(() => teams.id),
  createdAt: text("created_at")
    .$defaultFn(() => new Date().toISOString())
    .notNull(),
  updatedAt: text("updated_at")
    .$defaultFn(() => new Date().toISOString())
    .notNull(),
  inquiryId: text("inquiry_id")
    .notNull()
    .references(() => inquiries.id),
  quoteId: text("quote_id")
    .notNull()
    .references(() => quotes.id),
  type: text("type", {
    enum: ["REGULAR", "SAMPLE"],
  }).notNull(),
});

export type Order = InferSelectModel<typeof orders>;

export const insertOrderSchema = createInsertSchema(orders);

export const orderItems = sqliteTable(
  "order_items",
  {
    orderId: text("order_id")
      .notNull()
      .references(() => orders.id),
    productId: text("product_id")
      .notNull()
      .references(() => products.id),
    price: real("price").notNull(),
    quantity: real("quantity").notNull(),
    unit: text("unit").notNull(),
    createdAt: text("created_at")
      .$defaultFn(() => new Date().toISOString())
      .notNull(),
    updatedAt: text("updated_at")
      .$defaultFn(() => new Date().toISOString())
      .notNull(),
  },
  (table) => {
    return {
      pk: primaryKey({
        columns: [table.orderId, table.productId],
      }),
    };
  },
);

export type OrderItem = InferSelectModel<typeof orderItems>;

export const insertOrderItemSchema = createInsertSchema(orderItems);

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
  product: one(products, {
    fields: [orderItems.productId],
    references: [products.id],
  }),
}));

export const ordersRelations = relations(orders, ({ many, one }) => ({
  buyer: one(teams, {
    fields: [orders.buyerId],
    references: [teams.id],
  }),
  seller: one(teams, {
    fields: [orders.sellerId],
    references: [teams.id],
  }),
  inquiry: one(inquiries, {
    fields: [orders.inquiryId],
    references: [inquiries.id],
  }),
  quote: one(quotes, {
    fields: [orders.quoteId],
    references: [quotes.id],
  }),
  orderItems: many(orderItems),
}));

export const inquiryAuditLogs = sqliteTable("inquiry_audit_logs", {
  id: text("id").primaryKey().unique(),
  inquiryId: text("inquiry_id")
    .notNull()
    .references(() => inquiries.id),
  type: text("type", {
    enum: ["RAISE", "ACCEPT", "REJECT", "NEGOTIATE"],
  }).notNull(),
  performedBy: text("performed_by")
    .notNull()
    .references(() => users.id), // References the user who performed the action
  jsonData: text("json_data").notNull(), // Store JSON data as text
  message: text("message"), // Optional message
  createdAt: text("created_at")
    .$defaultFn(() => new Date().toISOString())
    .notNull(),
});

export type InquiryAuditLog = InferSelectModel<typeof inquiryAuditLogs>;

// Define specific types for each type of action
interface RaiseLogData {
  action: "RAISE";
  newQuoteId: string;
}

interface AcceptLogData {
  action: "ACCEPT";
  acceptedQuoteId: string;
}

interface RejectLogData {
  action: "REJECT";
  rejectedReason: string;
}

interface NegotiateLogData {
  action: "NEGOTIATE";
  previousQuoteId: string;
  newQuoteId: string;
}

// Define a discriminated union for `jsonData`
export type InquiryAuditLogData =
  | RaiseLogData
  | AcceptLogData
  | RejectLogData
  | NegotiateLogData;

export const notifications = sqliteTable("notifications", {
  id: text("id").primaryKey().unique(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  type: text("type", {
    enum: [
      "ORDER_PLACED",
      "ORDER_DISPATCHED",
      "ORDER_SHIPPED",
      "INQUIRY_RECEIVED",
      "NEW_QUOTE_RECEIVED",
      "QUOTE_ACCEPTED",
      "QUOTE_REJECTED",
    ],
  }).notNull(),
  orderId: text("order_id"),
  orderType: text("order_type", {
    enum: ["REGULAR", "SAMPLE"],
  }),
  inquiryId: text("inquiry_id"),
  quoteId: text("quote_id"),
  message: text("message").notNull(),
  createdAt: text("created_at")
    .$defaultFn(() => new Date().toISOString())
    .notNull(),
  read: integer("read", {
    mode: "boolean",
  }).notNull(),
});

export type Notification = InferSelectModel<typeof notifications>;

export const insertNotificationSchema = createInsertSchema(notifications);

export const notificationsRelations = relations(notifications, ({ one }) => ({
  user: one(users, {
    fields: [notifications.userId],
    references: [users.id],
  }),
  order: one(orders, {
    fields: [notifications.orderId],
    references: [orders.id],
  }),
  inquiry: one(inquiries, {
    fields: [notifications.inquiryId],
    references: [inquiries.id],
  }),
  quote: one(quotes, {
    fields: [notifications.quoteId],
    references: [quotes.id],
  }),
}));

export const devices = sqliteTable("devices", {
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  expoPushToken: text("expo_push_token").notNull().primaryKey().unique(),
});

export type Device = InferSelectModel<typeof devices>;

export const insertDeviceSchema = createInsertSchema(devices);

export const deviceRelations = relations(devices, ({ one }) => ({
  user: one(users, {
    fields: [devices.userId],
    references: [users.id],
  }),
}));
