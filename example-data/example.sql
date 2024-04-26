-- This will load one row per table as an example.
-- this will cause the sequences of the table to move forward
-- be careful if expecting any hardcoded row Id.

-- To Run: psql <LOGIN INFO> -f example-data/example.sql
BEGIN;
INSERT INTO participating_teams (default_name, team_name)
VALUES
    ('Team 1',	'Turkish Quandale Dingle'),
    ('Team 2',	'Jason Chang'),
    ('Team 3',	'Indecisives'),
    ('Team 4',	'Hardstuck StepBros'),
    ('Team 5',	'Cotton Carnos'),
    ('Team 6',	'Kitty Meow Meow Burger Time'),
    ('Team 7',	'Jeffrey Armstrong'),
    ('Team 8',	'2005 Honda Civic'),
    ('Team 9',	'Despair'),
    ('Team 10',	'Team IDC');

INSERT INTO agents (agent_name, agent_type)
VALUES
    ('Astra', 'controller'),
    ('Breach', 'initiator'),
    ('Brimstone', 'controller'),
    ('Chamber', 'sentinel'),
    ('Clove', 'controller'),
    ('Cypher', 'sentinel'),
    ('Deadlock', 'sentinel'),
    ('Fade', 'initiator'),
    ('Gekko', 'initiator'),
    ('Harbor', 'controller'),
    ('Iso', 'duelist'),
    ('Jett', 'duelist'),
    ('Kayo', 'initiator'),
    ('Killjoy', 'sentinel'),
    ('Neon', 'duelist'),
    ('Omen', 'controller'),
    ('Phoenix', 'duelist'),
    ('Raze', 'duelist'),
    ('Reyna', 'duelist'),
    ('Sage', 'sentinel'),
    ('Skye', 'initiator'),
    ('Sova', 'initiator'),
    ('Viper', 'controller'),
    ('Yoru', 'duelist');

INSERT INTO maps (map_name)
VALUES
    ('Ascent'),
    ('Bind'),
    ('Breeze'),
    ('Icebox'),
    ('Lotus'),
    ('Split'),
    ('Sunset');


COMMIT;