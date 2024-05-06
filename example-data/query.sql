-- Select round differential between teams
SELECT
    CASE WHEN rounds_for_a > rounds_for_b
        THEN team_a_id
        ELSE team_b_id
    END AS winning_team_id,
    ABS(rounds_for_a - rounds_for_b) AS round_differential
FROM matches_played
WHERE (team_a_id = $1 OR team_a_id = $2) AND (team_b_id = $1 OR team_b_id = $2)
GROUP BY winning_team_id;

-- For a team id, select the map differential
with wins_with_rounds as (
    select
        team_a_id = 1 as is_team_a,
        rounds_for_a,
        rounds_for_b
    from matches_played
    where team_a_id = 1 or team_b_id = 1
)
select sum(
    case when (cte.rounds_for_a > cte.rounds_for_b and cte.is_team_a)
        or (cte.rounds_for_a < cte.rounds_for_b and not cte.is_team_a)
    then 1
    else 0 
    end) as num_win,
    sum(
        case when (cte.rounds_for_a < cte.rounds_for_b and cte.is_team_a) 
            or (cte.rounds_for_a > cte.rounds_for_b and not cte.is_team_a)
        then 1 else 0
        end) as num_loss,
    SUM(cte.rounds_for_a - cte.rounds_for_b) as round_differential
from wins_with_rounds as cte;