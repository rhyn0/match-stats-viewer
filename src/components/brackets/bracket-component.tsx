import React, { Fragment } from "react";
import { BracketDiv } from "@/components/brackets";
import useMedia from "@/components/hooks/useMedia";
import { IRenderSeedProps } from "@/types";

export const renderTitle = (title: React.ReactNode) => (
    <BracketDiv variant="roundTitle">{title}</BracketDiv>
);

export const renderSeed = ({ seed, breakpoint }: IRenderSeedProps) => {
    return (
        <Seed mobileBreakpoint={breakpoint}>
            <SeedItem>
                <div>
                    <SeedTeam>
                        {seed.teams?.[0]?.name || "-----------"}
                    </SeedTeam>
                    <SeedTeam>
                        {seed.teams?.[1]?.name || "-----------"}
                    </SeedTeam>
                </div>
            </SeedItem>
            <SeedTime mobileBreakpoint={breakpoint}>{seed?.date}</SeedTime>
        </Seed>
    );
};

const SingleElimination = ({
    rounds,
    rtl = false,
    roundClassName,
    bracketClassName,
    swipeableProps = {},
    mobileBreakpoint = 992,
    renderSeedComponent = renderSeed,
    roundTitleComponent = renderTitle,
}: ISingleEliminationProps) => {
    // Checking responsive size
    const isResponsive = useMedia(mobileBreakpoint);

    const data = rounds.map((round, roundIdx) => (
        <Round
            key={round.title}
            className={roundClassName}
            mobileBreakpoint={mobileBreakpoint}
        >
            {round.title && roundTitleComponent(round.title, roundIdx)}
            <SeedsList>
                {round.seeds.map((seed, idx) => {
                    return (
                        <Fragment key={seed.id}>
                            {renderSeedComponent({
                                seed,
                                breakpoint: mobileBreakpoint,
                                roundIndex: roundIdx,
                                seedIndex: idx,
                                rounds,
                            })}
                        </Fragment>
                    );
                })}
            </SeedsList>
        </Round>
    ));

    if (isResponsive) {
        // Since SwipeableViewsProps have an issue that it uses ref inside of it, We need to remove ref from the object
        const { ref, ...rest } = swipeableProps;
        return (
            <Bracket
                className={bracketClassName}
                dir={rtl ? "rtl" : "ltr"}
                mobileBreakpoint={mobileBreakpoint}
            >
                <SwipeableViews
                    style={{ minHeight: "500px" }}
                    axis={rtl ? "x-reverse" : "x"}
                    {...rest}
                >
                    {data}
                </SwipeableViews>
            </Bracket>
        );
    }
    return (
        <Bracket
            className={bracketClassName}
            dir={rtl ? "rtl" : "ltr"}
            mobileBreakpoint={mobileBreakpoint}
        >
            {data}
        </Bracket>
    );
};

export { SingleElimination };
