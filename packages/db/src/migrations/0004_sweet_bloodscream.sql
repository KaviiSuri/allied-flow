CREATE TABLE `devices` (
	`user_id` text NOT NULL,
	`expo_push_token` text PRIMARY KEY NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `notifications` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`type` text NOT NULL,
	`order_id` text,
	`order_type` text,
	`inquiry_id` text,
	`quote_id` text,
	`message` text NOT NULL,
	`created_at` text NOT NULL,
	`read` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `devices_expo_push_token_unique` ON `devices` (`expo_push_token`);--> statement-breakpoint
CREATE UNIQUE INDEX `notifications_id_unique` ON `notifications` (`id`);