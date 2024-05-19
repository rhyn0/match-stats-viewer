import { Button } from "@/components/ui/button";
import Link from "next/link";
export default function NotFoundPage() {
    return (
        <main className="container bg-background pt-10">
            <div className="mx-auto flex h-1/2 w-1/2 flex-col justify-center">
                <h1 className="text-center text-xl">
                    Woops how did you get here?
                </h1>
                <h2 className="text-center text-lg">404 - Page Not Found</h2>
                <Button asChild>
                    <Link href="/">Go Home</Link>
                </Button>
            </div>
        </main>
    );
}
