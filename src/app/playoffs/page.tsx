import { getTeamIds } from "@/components/actions/teamDb";
import { PlayoffChecklistPanel } from "@/components/panel/PlayoffsChecklist";

export default async function PlayoffsPage() {
    const teamIds = await getTeamIds();
    return (
        <div className="flex flex-col">
            <PlayoffChecklistPanel teamIds={teamIds} />
        </div>
    );
}
