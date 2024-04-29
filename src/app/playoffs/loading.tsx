"use client";
import React from "react";
import {
    Bracket,
    IRenderSeedProps,
    Seed,
    SeedItem,
    SeedTeam,
    SeedTime,
} from "react-brackets";
// React DEV will complain because each round title and each seed id needs to be unique
const loadingData = [
    {
        title: "Playins",
        seeds: [
            {
                teams: [],
                id: 1,
            },
            {
                teams: [],
                id: 2,
            },
        ],
    },
    {
        title: "Quarter Finals",
        seeds: [
            {
                id: 3,
                teams: [],
            },
            {
                id: 4,
                teams: [],
            },
            {
                id: 5,
                teams: [],
            },
            {
                id: 6,
                teams: [],
            },
        ],
    },
    {
        title: "Semi Finals",
        seeds: [...new Array(2)]
            .fill({
                id: 7,
            })
            .map((val, idx) => ({ id: val.id + idx, teams: [] })),
    },
    {
        title: "Finals",
        seeds: [...new Array(1)]
            .fill({
                id: 8,
            })
            .map((val, idx) => ({ id: val.id + idx, teams: [] })),
    },
];

const RenderLoadingSeed = ({
    seed,
    breakpoint,
    roundIndex,
    seedIndex,
}: IRenderSeedProps) => {
    return (
        <Seed
            // style={{
            //   minWidth: 175,
            //   fontSize: 11,
            // }}
            mobileBreakpoint={breakpoint}
            className=" "
        >
            <SeedItem className="after:animate-loop-shimmer relative animate-pulse overflow-hidden bg-repeat-y after:absolute after:bottom-0 after:left-0 after:right-0 after:top-0 after:-translate-x-full after:bg-gradient-to-tr after:content-none">
                <div>
                    {/* you can use height instead of adding a dot also :O */}
                    <SeedTeam>Round {roundIndex}</SeedTeam>
                    <SeedTeam>Seed {seedIndex}</SeedTeam>
                </div>
            </SeedItem>
            <SeedTime
                mobileBreakpoint={breakpoint}
                style={{ fontSize: 9 }}
            >
                {seed.date}
            </SeedTime>
        </Seed>
    );
};

export default function LoadingBracket() {
    return (
        <main>
            <Bracket
                rounds={loadingData}
                renderSeedComponent={RenderLoadingSeed}
            />
        </main>
    );
}
