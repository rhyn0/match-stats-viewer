import { BracketDisplay } from "@/components/Brackets";
import { sleep } from "@/lib/sleep";
import { IRoundProps } from "react-brackets";
const matchExample: IRoundProps[] = [
    {
        title: "Round one",
        seeds: [
            {
                id: 1,
                date: new Date().toDateString(),
                teams: [{ name: "Team A" }, { name: "Team B" }],
            },
            {
                id: 2,
                date: new Date().toDateString(),
                teams: [{ name: "Team C" }, { name: "Team D" }],
            },
        ],
    },
    {
        title: "Round one",
        seeds: [
            {
                id: 3,
                date: new Date().toDateString(),
                teams: [{ name: "Team A" }, { name: "Team C" }],
            },
        ],
    },
];
async function getPlayoffMatchData(): Promise<IRoundProps[]> {
    await sleep(100_000);
    return matchExample;
}

export default async function PlayoffsPage() {
    const matchData = await getPlayoffMatchData();
    return (
        <main>
            <div>
                <BracketDisplay matches={matchData} />
            </div>
        </main>
    );
}
