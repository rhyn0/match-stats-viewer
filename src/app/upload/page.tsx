"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React from "react";
import Papa from "papaparse";
import UploadMatchDataForm from "@/components/UploadMatchDataForm";
import { MatchData, MatchDataZ } from "../../components/uploadColumns";

export default function UploadPage() {
    const [uploaded, setUploaded] = React.useState<boolean>(false);
    const [matchData, setMatchData] = React.useState<MatchData[] | null>(null);
    const onFileChange: React.ChangeEventHandler<HTMLInputElement> =
        React.useCallback(
            (e) => {
                const files = e.target.files;
                if (!files || files.length === 0) {
                    console.error("No Files Uploaded");
                    return;
                }
                const file = files[0];
                const reader = new FileReader();
                reader.onload = (event) => {
                    const result = event.target?.result;
                    if (!result) {
                        console.error("Failed to receive file text contents");
                        return;
                    }
                    setUploaded(true);
                    const csvResults = Papa.parse(result.toString(), {
                        header: true,
                        skipEmptyLines: true,
                        transformHeader(header: string) {
                            return header.replaceAll(/\s/gm, "_").toLowerCase();
                        },
                    });

                    if (csvResults.errors.length > 0) {
                        console.error(...csvResults.errors);
                    }
                    const zodResults = MatchDataZ.array().safeParse(
                        csvResults.data,
                    );
                    if (!zodResults.success) {
                        console.error(
                            "Failed to parse out expected data from given file",
                            zodResults.error,
                        );
                    } else {
                        setMatchData(csvResults.data as MatchData[]);
                    }
                };
                reader.readAsText(file);
            },
            [setUploaded],
        );
    React.useEffect(() => {
        if (!uploaded || Boolean(matchData)) return;
        const timeout = setTimeout(() => setUploaded(false), 2000);

        return () => clearTimeout(timeout);
    }, [uploaded, matchData]);
    return (
        <div className="container">
            {!uploaded ? (
                <>
                    <Label htmlFor="statsFile">Upload New Matches</Label>
                    <Input
                        id="statsFile"
                        type="file"
                        // immediately read on client side
                        onChange={onFileChange}
                    />
                </>
            ) : matchData ? (
                <UploadMatchDataForm matchData={matchData} />
            ) : (
                <div className="text-red flex justify-center align-middle text-3xl">
                    No Data Found
                </div>
            )}
        </div>
    );
}
