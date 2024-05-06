"use client";
// Want to be able to let user find out, 2 way tie who wins head to head

import {
    Head2HeadChecklistResult,
    TeamH2HOverall,
    TeamHeadToHead,
    TeamIdentifiers,
} from "@/types";
import { HeadToHead2WayForm, HeadToHead2WaySelector } from "../Head2HeadPicker";
import { getTeamHeadToHead, getTeamOverall } from "../actions/teamDb";
import { twoWaySteps } from "@/app/constants";
import React from "react";
import { PlayoffsCheckbox } from "../PlayoffsCheckbox";

export interface PlayoffChecklistPanelProps {
    teamIds: TeamIdentifiers[];
}
export function PlayoffChecklistPanel({ teamIds }: PlayoffChecklistPanelProps) {
    const [teamH2H, setTeamH2H] = React.useState<TeamHeadToHead[]>([]);
    const [teamOverallStats, setTeamOverallStats] = React.useState<
        TeamH2HOverall[]
    >([]);
    const [teamNames, setTeamNames] = React.useState<(string | undefined)[]>(
        [],
    );
    function onSubmit(values: HeadToHead2WayForm): void {
        getTeamHeadToHead(values).then((resp) => setTeamH2H(resp));
        setTeamNames([
            teamIds.find(({ teamId }) => values.teamAId === teamId)?.teamName,
            teamIds.find(({ teamId }) => values.teamBId === teamId)?.teamName,
        ]);
        // happy path stuff
        Promise.all([
            getTeamOverall(values.teamAId),
            getTeamOverall(values.teamBId),
        ]).then((result) => setTeamOverallStats(result));
    }

    return (
        <div className="flex flex-col space-y-24">
            <h1 className="text-center text-2xl">
                Playoffs Two-Way Head-to-Head Checker
            </h1>
            <PlayoffsCheckbox
                leftTeamName={teamNames[0]}
                rightTeamName={teamNames[1]}
                steps={twoWaySteps}
                checkedSteps={calculateTwoWayCheckedSteps(
                    teamIds[0].teamId,
                    teamH2H,
                    teamOverallStats,
                )}
            />
            <div className="container mx-auto mt-10 flex justify-center">
                <HeadToHead2WaySelector
                    teamIds={teamIds}
                    onSubmit={onSubmit}
                />
            </div>
        </div>
    );
}

// box is checked if they are tied.
function calculateTwoWayCheckedSteps(
    leftTeamId: number,
    h2hState: TeamHeadToHead[],
    overallStats: TeamH2HOverall[],
): Head2HeadChecklistResult[] {
    // - Head-to-head Map differential
    // - Head-to-head Round differential
    // - Map differential
    // - Round differential
    // was a sweep 2-0 in maps
    const checkedInitial = [false, false, false, false];
    const leftOrRight = (winner: number) =>
        leftTeamId === winner ? "left" : "right";
    if (h2hState.length !== 2 || overallStats.length !== 2) {
        return [
            h2hState[0]?.winnerId ? leftOrRight(h2hState[0].winnerId) : false,
            false,
            false,
            false,
        ];
    }
    const [leftH2h, rightH2h] = h2hState;
    const [leftOverall, rightOverall] = overallStats;
    if (leftH2h.roundDiff !== rightH2h.roundDiff) {
        return Array(1)
            .fill("tied")
            .concat(
                leftOrRight(
                    leftH2h.roundDiff > rightH2h.roundDiff
                        ? leftH2h.winnerId
                        : rightH2h.winnerId,
                ),
                checkedInitial.slice(2),
            );
    } else if (leftOverall.mapDiff !== rightOverall.mapDiff) {
        return Array(2)
            .fill("tied")
            .concat(
                leftOrRight(
                    leftOverall.mapDiff > rightOverall.mapDiff
                        ? leftOverall.teamId
                        : rightOverall.teamId,
                ),
                checkedInitial.slice(3),
            );
    } else if (leftOverall.roundDiff !== rightOverall.roundDiff) {
        return Array(3)
            .fill("tied")
            .concat(
                leftOrRight(
                    leftOverall.roundDiff > rightOverall.roundDiff
                        ? leftOverall.teamId
                        : rightOverall.teamId,
                ),
                checkedInitial.slice(2),
            );
    } else {
        return Array(4).fill("tied");
    }
}
