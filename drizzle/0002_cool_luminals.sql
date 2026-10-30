CREATE TABLE `account_sessions` (
	`token_hash` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`expires_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `account_users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `account_users` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`name` text NOT NULL,
	`password_hash` text NOT NULL,
	`role` text NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `account_users_email_unique` ON `account_users` (`email`);--> statement-breakpoint
CREATE TABLE `auth_attempts` (
	`key` text NOT NULL,
	`bucket` integer NOT NULL,
	`count` integer NOT NULL,
	`expires_at` integer NOT NULL,
	PRIMARY KEY(`key`, `bucket`)
);
