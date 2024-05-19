"use client";
import { MatchData, columns } from "@/components/uploadColumns";
import { Button } from "./ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { DataTable } from "./dataTable";
import { PlayerMatchRecord, UploadMatchData } from "@/types";
import { parseKda, parseRoundCount } from "@/lib/statsParse";
import React from "react";

export interface UploadMatchDataFormProps {
    matchData: MatchData[];
}

function formatMatchDataToUpload(
    value: MatchData,
    isPlayoffs: boolean,
): UploadMatchData {
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
        isPlayoffs,
    };
}

export default function UploadMatchDataForm({
    matchData,
}: UploadMatchDataFormProps) {
    const [isPlayoffs, setIsPlayoffs] = React.useState<boolean>(false);
    const onSubmit = React.useCallback(() => {
        const uploadData = matchData.map((match) =>
            formatMatchDataToUpload(match, isPlayoffs),
        );
        fetch("/api/new", {
            method: "POST",
            body: JSON.stringify(uploadData),
        });
    }, [matchData, isPlayoffs]);
    const pagination = {
        pageSize: 10,
        pageIndex: 0,
    };
    return (
        <>
            <div className="flex flex-row justify-between">
                <Button
                    size="lg"
                    onClick={onSubmit}
                >
                    Upload
                </Button>
                <IsPlayoffsSwitch
                    checked={isPlayoffs}
                    onCheckedChange={setIsPlayoffs}
                />
            </div>
            <DataTable
                data={matchData}
                columns={columns}
                pagination={pagination}
            />
        </>
    );
}
function IsPlayoffsSwitch({
    checked,
    onCheckedChange,
}: {
    checked: boolean;
    onCheckedChange: React.Dispatch<React.SetStateAction<boolean>>;
}) {
    return (
        <div>
            <Label
                htmlFor="playoffs-switch"
                className="text-lg font-semibold"
            >
                Is Playoffs
            </Label>
            <p className="text-muted-foreground">
                Whether <strong>ALL</strong> matches in the table are for
                playoffs
            </p>
            <Switch
                checked={checked}
                onCheckedChange={onCheckedChange}
            />
        </div>
    );
}
