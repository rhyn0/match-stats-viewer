import { InteractionDataTODO } from "@/types";

interface TooltipProps {
    interactionData: InteractionDataTODO | undefined;
    width: number;
    height: number;
}

export const Tooltip = ({ interactionData, width, height }: TooltipProps) => {
    if (!interactionData) {
        return null;
    }

    console.log("🚀 ~ Tooltip ~ interactionData:", interactionData);
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
                className="absolulute ml-4 -translate-y-1/2 rounded border-transparent bg-black p-1 text-base text-white after:absolute after:-left-1/2 after:top-1/2 after:-translate-y-1/2 after:border-4 after:content-none"
                style={{
                    left: xPos,
                    top: yPos,
                }}
            >
                <TooltipRow
                    label="x"
                    value={rest.colName}
                />
                <TooltipRow
                    label="y"
                    value={rest.rowName}
                />
                <TooltipRow
                    label="value"
                    value={rest.value}
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
        <div>
            <b>{label}</b>
            <span>: </span>
            <span>{value}</span>
        </div>
    );
}
