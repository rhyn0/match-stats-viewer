import { DataT, ExtraLabels, InteractionData } from "@/types";

interface TooltipProps<TData extends DataT> {
    interactionData: InteractionData<TData> | undefined;
    width: number;
    height: number;
    extraLabels?: ExtraLabels<TData>[];
}

export const Tooltip = <TData extends DataT>({
    interactionData,
    width,
    height,
    extraLabels = [],
}: TooltipProps<TData>) => {
    if (!interactionData) {
        return null;
    }

    const { xPos, yPos, ...rest } = interactionData;
    // The type of `rest` becomes TData here after removing the InteractionData keys

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
                    label="Column"
                    value={rest.colKey}
                />
                <TooltipRow
                    label="Row"
                    value={rest.rowKey}
                />
                {extraLabels.map(({ name, key }) => (
                    <TooltipRow
                        key={key.toString()}
                        label={name}
                        // @ts-expect-error - `rest` is indexable by any keyof TData
                        value={rest[key].toString()}
                    />
                ))}
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
