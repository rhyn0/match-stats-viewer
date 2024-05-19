import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

import { cn } from "@/lib/utils";
import Link, { LinkProps } from "next/link";
import React from "react";
import { Menu } from "lucide-react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { ScrollArea } from "./ui/scroll-area";

const navComponents = {
    regularSeason: {
        triggerTitle: "Regular Season",
        links: [
            {
                title: "Player Statistics",
                href: "/stats/player",
                description:
                    "Table view of player statistics across the regular season. Displaying KDA statistics as well as preferred Agents to play.",
            },
            {
                title: "Team Statistics",
                href: "/stats/team",
                description:
                    "Table view of team statistics across the regular season. Displaying per map win rates and overall round count trends.",
            },
        ],
    },
    playoffs: {
        triggerTitle: "Playoffs",
        links: [
            {
                title: "Head To Head Breaker",
                href: "/playoffs",
                description:
                    "Check head-to-head matchups and who breaks ties where. Useful information when seeding is being decided and need to know who comes out on top.",
            },
        ],
    },
};

export function NavigationBar() {
    return (
        <>
            <MainNavigationBar />
            <MobileNavigationBar />
        </>
    );
}
function MainNavigationBar() {
    return (
        <NavigationMenu className="hidden md:flex">
            <NavigationMenuList>
                <NavigationMenuItem>
                    <NavLink
                        href="/upload"
                        title="Upload Match Stats"
                        className={navigationMenuTriggerStyle()}
                    />
                </NavigationMenuItem>
                {Object.entries(navComponents).map(([key, navigation]) => (
                    <NavigationMenuItem key={key}>
                        <NavigationMenuTrigger>
                            {navigation.triggerTitle}
                        </NavigationMenuTrigger>
                        <NavigationMenuContent>
                            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                                {navigation.links.map((link) => (
                                    <li key={link.title}>
                                        <NavLink
                                            href={link.href}
                                            title={link.title}
                                        >
                                            {link.description}
                                        </NavLink>
                                    </li>
                                ))}
                            </ul>
                        </NavigationMenuContent>
                    </NavigationMenuItem>
                ))}
            </NavigationMenuList>
        </NavigationMenu>
    );
}

interface NavLinkProps {
    href: string;
    title: string;
    children?: React.ReactNode;
    className?: string;
}
function NavLink({ href, children, title, className }: NavLinkProps) {
    return (
        <Link
            href={href}
            legacyBehavior
            passHref
        >
            <NavigationMenuLink
                className={cn(
                    "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                    className,
                )}
            >
                <div className="text-sm font-medium leading-none">{title}</div>
                {children ? (
                    <p className="line-clamp-2 text-wrap text-sm leading-snug text-muted-foreground">
                        {children}
                    </p>
                ) : null}
            </NavigationMenuLink>
        </Link>
    );
}

function MobileNavigationBar() {
    const [open, setOpen] = React.useState<boolean>(false);
    return (
        <Sheet
            open={open}
            onOpenChange={setOpen}
        >
            <SheetTrigger asChild>
                <Button
                    variant="ghost"
                    className="mt-1 md:hidden"
                >
                    <Menu />
                    <span className="sr-only">Toggle Menu</span>
                </Button>
            </SheetTrigger>
            <SheetContent
                side="left"
                className="pr-0"
            >
                <ScrollArea className="my-4 h-[calc(100vh-8rem)] pb-10 pl-6">
                    <div className="flex flex-col space-y-4">
                        {Object.entries(navComponents).map(
                            ([key, navigation]) => (
                                <div
                                    key={key}
                                    className="flex flex-col space-y-2 pt-4"
                                >
                                    <h4>
                                        {navigation.triggerTitle.toUpperCase()}
                                    </h4>
                                    {navigation.links.map(({ title, href }) => (
                                        <MobileLink
                                            key={title}
                                            href={href}
                                            onOpenChange={setOpen}
                                            className="text-muted-foreground"
                                        >
                                            {title}
                                        </MobileLink>
                                    ))}
                                </div>
                            ),
                        )}
                    </div>
                </ScrollArea>
            </SheetContent>
        </Sheet>
    );
}

interface MobileLinkProps extends LinkProps {
    // eslint-disable-next-line no-unused-vars
    onOpenChange?: (open: boolean) => void;
    children: React.ReactNode;
    className?: string;
}

function MobileLink({
    href,
    onOpenChange,
    className,
    children,
    ...props
}: MobileLinkProps) {
    const router = useRouter();
    return (
        <Link
            href={href}
            onClick={() => {
                router.push(href.toString());
                onOpenChange?.(false);
            }}
            className={cn(className)}
            {...props}
        >
            {children}
        </Link>
    );
}
