CREATE TABLE `devices` (
	`user_id` text NOT NULL,
	`expo_push_token` text PRIMARY KEY NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `devices_expo_push_token_unique` ON `devices` (`expo_push_token`);