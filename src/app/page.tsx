import { Button } from "@/components/ui/button";
import Link from "next/link";
export default function Home() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            Hello World
            <div className="flex flex-row space-x-8 border-4 border-white">
                <Button asChild>
                    <Link href={"/upload"}>Upload</Link>
                </Button>
                <Button asChild>
                    <Link href={"/stats"}>Statistics</Link>
                </Button>
            </div>
        </main>
    );
}
