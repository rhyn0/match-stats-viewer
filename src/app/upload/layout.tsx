import { BackButton } from "@/components/BackButton";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Upload Match Statistics",
};

export default async function UploadLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <main>
            <BackButton />
            {children}
        </main>
    );
}
