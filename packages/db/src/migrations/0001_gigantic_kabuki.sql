CREATE TABLE `inquiries` (
	`id` text PRIMARY KEY NOT NULL,
	`status` text NOT NULL,
	`tnc` text NOT NULL,
	`remarks` text,
	`buyer_id` text NOT NULL,
	`seller_id` text NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`buyer_id`) REFERENCES `teams`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`seller_id`) REFERENCES `teams`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `inquiry_audit_logs` (
	`id` text PRIMARY KEY NOT NULL,
	`inquiry_id` text NOT NULL,
	`type` text NOT NULL,
	`performed_by` text NOT NULL,
	`json_data` text NOT NULL,
	`message` text,
	`created_at` text NOT NULL,
	FOREIGN KEY (`inquiry_id`) REFERENCES `inquiries`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`performed_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `order_items` (
	`order_id` text NOT NULL,
	`product_id` text NOT NULL,
	`price` real NOT NULL,
	`quantity` real NOT NULL,
	`unit` text NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	PRIMARY KEY(`order_id`, `product_id`),
	FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `orders` (
	`id` text PRIMARY KEY NOT NULL,
	`status` text NOT NULL,
	`buyer_id` text NOT NULL,
	`seller_id` text NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	`inquiry_id` text NOT NULL,
	`quote_id` text NOT NULL,
	`type` text NOT NULL,
	FOREIGN KEY (`buyer_id`) REFERENCES `teams`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`seller_id`) REFERENCES `teams`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`inquiry_id`) REFERENCES `inquiries`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`quote_id`) REFERENCES `quotes`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `products` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`make` text NOT NULL,
	`cas` text NOT NULL,
	`desc` text NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	`search_name` text NOT NULL,
	`search_make` text NOT NULL,
	`search_cas` text NOT NULL,
	`search_desc` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `quote_items` (
	`quote_id` text NOT NULL,
	`product_id` text NOT NULL,
	`price` real NOT NULL,
	`quantity` real NOT NULL,
	`unit` text NOT NULL,
	`prev_price` real,
	`prev_quantity` real,
	`sample_requested` integer NOT NULL,
	`tech_document_requested` integer NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	PRIMARY KEY(`product_id`, `quote_id`),
	FOREIGN KEY (`quote_id`) REFERENCES `quotes`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `quotes` (
	`id` text PRIMARY KEY NOT NULL,
	`status` text NOT NULL,
	`inquiry_id` text NOT NULL,
	`created_by` text NOT NULL,
	`created_by_team` text NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`inquiry_id`) REFERENCES `inquiries`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`created_by_team`) REFERENCES `teams`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `inquiries_id_unique` ON `inquiries` (`id`);--> statement-breakpoint
CREATE UNIQUE INDEX `inquiry_audit_logs_id_unique` ON `inquiry_audit_logs` (`id`);--> statement-breakpoint
CREATE UNIQUE INDEX `orders_id_unique` ON `orders` (`id`);--> statement-breakpoint
CREATE UNIQUE INDEX `products_id_unique` ON `products` (`id`);--> statement-breakpoint
CREATE UNIQUE INDEX `quotes_id_unique` ON `quotes` (`id`);