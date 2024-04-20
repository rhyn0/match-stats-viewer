DO $$ BEGIN
 CREATE TYPE "agent_types" AS ENUM('controller', 'sentinel', 'duelist', 'initiator');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "agents" (
	"id" serial PRIMARY KEY NOT NULL,
	"agent_name" varchar NOT NULL,
	"agent_type" "agent_types"
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "maps" (
	"id" serial PRIMARY KEY NOT NULL,
	"map_name" varchar NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "matches_played" (
	"id" serial PRIMARY KEY NOT NULL,
	"team_a_name" varchar(256),
	"team_a_id" integer NOT NULL,
	"team_b_name" varchar(256),
	"team_b_id" integer NOT NULL,
	"raw_rounds" varchar(5) NOT NULL,
	"rounds_for_a" integer NOT NULL,
	"rounds_for_b" integer NOT NULL,
	"match_date" date DEFAULT now() NOT NULL,
	"map_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "players" (
	"id" serial PRIMARY KEY NOT NULL,
	"team_id" integer,
	"player_name" varchar NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "player_matches" (
	"id" serial PRIMARY KEY NOT NULL,
	"player_id" integer,
	"match_id" integer,
	"agent_id" integer,
	"match_place" integer NOT NULL,
	"raw_kda" varchar(10) NOT NULL,
	"player_kills" integer NOT NULL,
	"player_deaths" integer NOT NULL,
	"player_assists" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "participating_teams" (
	"id" serial PRIMARY KEY NOT NULL,
	"default_name" varchar NOT NULL,
	"team_name" varchar,
	"modified_at" timestamp with time zone
);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "agent_name_uniq_idx" ON "agents" ("agent_name");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "map_name_uniq_idx" ON "maps" ("map_name");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "player_name_uniq_idx" ON "players" ("player_name");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "matches_played" ADD CONSTRAINT "matches_played_team_a_id_participating_teams_id_fk" FOREIGN KEY ("team_a_id") REFERENCES "participating_teams"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "matches_played" ADD CONSTRAINT "matches_played_team_b_id_participating_teams_id_fk" FOREIGN KEY ("team_b_id") REFERENCES "participating_teams"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "matches_played" ADD CONSTRAINT "matches_played_map_id_maps_id_fk" FOREIGN KEY ("map_id") REFERENCES "maps"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "player_matches" ADD CONSTRAINT "player_matches_player_id_players_id_fk" FOREIGN KEY ("player_id") REFERENCES "players"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "player_matches" ADD CONSTRAINT "player_matches_match_id_matches_played_id_fk" FOREIGN KEY ("match_id") REFERENCES "matches_played"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "player_matches" ADD CONSTRAINT "player_matches_agent_id_agents_id_fk" FOREIGN KEY ("agent_id") REFERENCES "agents"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
