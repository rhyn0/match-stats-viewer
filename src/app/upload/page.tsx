import { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { BackButton } from "@/components/BackButton";
export const metadata: Metadata = {
    title: "Upload Match Statistics",
};

export default async function UploadPage() {
    return (
        <main>
            <BackButton />
            <div>
                <Button>Upload</Button>
            </div>
        </main>
    );
}
