"use client";
import { MatchData, columns } from "@/components/uploadColumns";
import { Button } from "./ui/button";
import { DataTable } from "./dataTable";
import { PlayerMatchRecord, UploadMatchData } from "@/types";
import { parseKda, parseRoundCount } from "@/lib/statsParse";
import React from "react";

export interface UploadMatchDataFormProps {
    matchData: MatchData[];
}

function formatMatchDataToUpload(value: MatchData): UploadMatchData {
    const [roundsA, roundsB] = parseRoundCount(value.round_count);
    const playerMatchRecords: PlayerMatchRecord[] = [];
    for (let idx = 1; idx <= 10; idx++) {
        const playerKey = `player_${idx}`;
        const [kills, deaths, assists] = parseKda(
            // @ts-expect-error - i know what im doing
            value[`${playerKey}_kda`],
        );
        playerMatchRecords.push({
            // @ts-expect-error - i know what im doing
            playerName: value[`${playerKey}_name`],
            // @ts-expect-error - i know what im doing

            agentName: value[`${playerKey}_agent`],
            kda: {
                // @ts-expect-error - i know what im doing
                raw: value[`${playerKey}_kda`],
                kills,
                deaths,
                assists,
            },
        });
    }
    return {
        matchRecord: {
            teamAName: value.team_name_a,
            teamBName: value.team_name_b,
            roundCount: {
                raw: value.round_count,
                roundsA,
                roundsB,
            },
            date: value.match_date,
            mapName: value.map_name,
        },
        playerNames: playerMatchRecords.map((record) => record.playerName),
        playerMatchRecords,
    };
}

export default function UploadMatchDataForm({
    matchData,
}: UploadMatchDataFormProps) {
    const onSubmit = React.useCallback(() => {
        const uploadData = matchData.map((match) =>
            formatMatchDataToUpload(match),
        );
        fetch("/api/new", {
            method: "POST",
            body: JSON.stringify(uploadData),
        });
    }, [matchData]);
    const pagination = {
        pageSize: 10,
        pageIndex: 0,
    };
    return (
        <>
            <Button
                size="lg"
                onClick={onSubmit}
            >
                Upload
            </Button>
            <DataTable
                data={matchData}
                columns={columns}
                pagination={pagination}
            />
        </>
    );
}
