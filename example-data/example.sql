-- This will load one row per table as an example.
-- this will cause the sequences of the table to move forward
-- be careful if expecting any hardcoded row Id.

-- To Run: psql <LOGIN INFO> -f example-data/example.sql
BEGIN;
INSERT INTO participating_teams (default_name, team_name)
VALUES ('team 1', 'Example team');

INSERT INTO agents (agent_name, agent_type)
VALUES ('Astra', 'controller');

INSERT INTO maps (map_name)
VALUES ('Ascent');

INSERT INTO players (team_id, player_name) 
SELECT t.id, 'EL33T'
FROM participating_teams t
WHERE t.default_name = 'team 1'
ORDER BY t.id ASC
LIMIT 1;

-- This will be weird but is valid according to schema
INSERT INTO matches_played
    (
        team_a_name,
        team_a_id,
        team_b_name,
        team_b_id,
        raw_rounds,
        rounds_for_a,
        rounds_for_b,
        map_id
    )
SELECT
    t.team_name,
    t.id,
    t.team_name,
    t.id,
    '11-13',
    11,
    13,
    m.id
FROM participating_teams t, maps m
WHERE t.default_name = 'team 1' AND m.map_name = 'Ascent'
LIMIT 1;

INSERT INTO player_matches
    (
        player_id,
        match_id,
        agent_id,
        match_place,
        raw_kda,
        player_kills,
        player_deaths,
        player_assists
    )
SELECT
    pl.id,
    mp.id,
    a.id,
    1,
    '20/10/2',
    20,
    10,
    2
FROM players pl, matches_played mp, agents a
WHERE 
    pl.player_name = 'EL33T' AND
    mp.raw_rounds = '11-13' AND
    a.agent_name = 'Astra'
LIMIT 1;

COMMIT;