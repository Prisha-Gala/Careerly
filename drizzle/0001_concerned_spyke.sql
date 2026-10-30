CREATE TABLE `ai_usage` (
	`owner` text NOT NULL,
	`hour` text NOT NULL,
	`count` integer NOT NULL,
	PRIMARY KEY(`owner`, `hour`)
);
