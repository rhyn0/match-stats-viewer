import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import { Header } from "@/components/Header";
import { ThemeProvider } from "@/components/providers/themeProvider";
import { siteConfig } from "@/config/site";
import { TailwindIndicator } from "@/components/tailwindIndicator";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: siteConfig.metadata.title,
    description: siteConfig.metadata.description,
    creator: "Ryan Ozawa",
    keywords: ["Next.js", "React", "Tailwind CSS", "Server Components"],
};
export const viewport: Viewport = {
    themeColor: [
        { media: "(prefers-color-scheme: light)", color: "white" },
        { media: "(prefers-color-scheme: dark)", color: "black" },
    ],
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html
            lang="en"
            suppressHydrationWarning
        >
            <body className={inter.className}>
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                >
                    <Header className="h-12 leading-[3rem]" />
                    {children}
                    <TailwindIndicator />
                </ThemeProvider>
            </body>
        </html>
    );
}
