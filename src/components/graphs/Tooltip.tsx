import { InteractionData } from "@/types";

interface TooltipProps {
    interactionData: InteractionData | undefined;
    width: number;
    height: number;
}

export const Tooltip = ({ interactionData, width, height }: TooltipProps) => {
    if (!interactionData) {
        return null;
    }

    const { xPos, yPos, ...rest } = interactionData;

    return (
        <div
            // className={styles.tooltip}
            style={{
                width: width,
                height: height,
                position: "absolute",
                top: 0,
                left: 0,
                pointerEvents: "none",
            }}
        >
            <div
                className="absolute ml-4 max-h-fit w-1/4 -translate-y-1/2 rounded border-transparent bg-black p-1 pl-2 text-base text-white after:absolute after:-left-1/2 after:top-1/2 after:-translate-y-1/2 after:border-4 after:content-none dark:bg-slate-300 dark:text-black"
                style={{
                    left: xPos,
                    top: yPos,
                }}
            >
                <TooltipRow
                    label="x"
                    value={rest.colKey}
                />
                <TooltipRow
                    label="y"
                    value={rest.rowKey}
                />
                <TooltipRow
                    label="Wins"
                    value={rest.wins.toString()}
                />
                <TooltipRow
                    label="Times Played"
                    value={rest.plays.toString()}
                />
            </div>
        </div>
    );
};

interface TooltipRowProps {
    label: string;
    value: string;
}

function TooltipRow({ label, value }: TooltipRowProps) {
    return (
        <div className="text-sm">
            <b>{label}</b>
            <span>: </span>
            <span>{value}</span>
        </div>
    );
}
