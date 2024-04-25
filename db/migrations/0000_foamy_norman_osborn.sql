CREATE TABLE `agents` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`agent_name` text NOT NULL,
	`agent_type` text
);
--> statement-breakpoint
CREATE TABLE `maps` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`map_name` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `matches_played` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`team_a_name` text(256),
	`team_a_id` integer NOT NULL,
	`team_b_name` text(256),
	`team_b_id` integer NOT NULL,
	`raw_rounds` text(5) NOT NULL,
	`rounds_for_a` integer NOT NULL,
	`rounds_for_b` integer NOT NULL,
	`match_date` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`map_id` integer NOT NULL,
	FOREIGN KEY (`team_a_id`) REFERENCES `participating_teams`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`team_b_id`) REFERENCES `participating_teams`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`map_id`) REFERENCES `maps`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `players` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`team_id` integer,
	`player_name` text NOT NULL,
	FOREIGN KEY (`team_id`) REFERENCES `participating_teams`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `player_matches` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`player_id` integer,
	`match_id` integer,
	`agent_id` integer,
	`match_place` integer NOT NULL,
	`raw_kda` text(10) NOT NULL,
	`player_kills` integer NOT NULL,
	`player_deaths` integer NOT NULL,
	`player_assists` integer NOT NULL,
	FOREIGN KEY (`player_id`) REFERENCES `players`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`match_id`) REFERENCES `matches_played`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`agent_id`) REFERENCES `agents`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `participating_teams` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`default_name` text NOT NULL,
	`team_name` text,
	`modified_at` integer DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE UNIQUE INDEX `agent_name_uniq_idx` ON `agents` (`agent_name`);--> statement-breakpoint
CREATE UNIQUE INDEX `map_name_uniq_idx` ON `maps` (`map_name`);--> statement-breakpoint
CREATE UNIQUE INDEX `player_name_uniq_idx` ON `players` (`player_name`);