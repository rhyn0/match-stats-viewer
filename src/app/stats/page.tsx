import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function StatsNavPage() {
    return (
        <div className="my-16 flex flex-row justify-center space-x-8">
            <Button asChild>
                <Link href={"/stats/player"}>Player Statistics</Link>
            </Button>
            <Button asChild>
                <Link href={"/stats/team"}>Team Statistics</Link>
            </Button>
        </div>
    );
}
