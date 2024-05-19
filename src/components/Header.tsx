"use client";
import Link from "next/link";
import Image from "next/image";
import React from "react";

import { ThemePicker } from "./themePicker";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/config/site";
import { buttonVariants } from "./ui/button";
import { Icons } from "./icons";
import { NavigationBar } from "./NavigationBar";

interface HeaderProps {
    className?: string;
}

export function Header({ className }: HeaderProps) {
    return (
        <header className={cn("bg-secondary align-middle", className)}>
            <div className="container flex">
                <div className="flex space-x-8 md:justify-start">
                    <div>
                        <Link
                            href="/"
                            scroll
                            className="flex items-center space-x-2"
                        >
                            <Image
                                src="/img/slovct-logo.png"
                                alt="SLOVCT"
                                height={40}
                                width={40}
                            />
                            Match Stats Viewer
                        </Link>
                    </div>
                    <NavigationBar />
                </div>
                <div className="flex flex-1 md:justify-end">
                    <nav className="flex items-center space-x-2">
                        <Link href={siteConfig.github.link}>
                            <div
                                className={cn(
                                    buttonVariants({ variant: "ghost" }),
                                    "mb-1 w-9 px-0 align-middle",
                                )}
                            >
                                <Icons.github className="size-5" />
                                <span className="sr-only">GitHub</span>
                            </div>
                        </Link>
                        <ThemePicker />
                    </nav>
                </div>
            </div>
        </header>
    );
}
