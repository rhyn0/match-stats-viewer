import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { RangeHeatMap } from "./graphs/RangeHeatmap";
import { DataT, ExtraLabels } from "@/types";
import { Button } from "./ui/button";

export interface DialogHeatmapProps<TData extends DataT> {
    data: TData[];
    title: string;
    description: string;
    minMax?: [number, number];
    extraLabels?: ExtraLabels<TData>[];
    disableRowLabels?: boolean;
    disableColLabels?: boolean;
}
export function DialogHeatmap<TData extends DataT>({
    data,
    title,
    description,
    minMax,
    extraLabels,
    disableColLabels = false,
    disableRowLabels = false,
}: DialogHeatmapProps<TData>) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="default">Open Graph</Button>
            </DialogTrigger>
            <DialogContent className="max-h-fit min-w-fit">
                <RangeHeatMap
                    data={data}
                    width={600}
                    title={title}
                    description={description}
                    height={600}
                    minMax={minMax}
                    margin={{ top: 80, right: 25, bottom: 60, left: 70 }}
                    extraLabels={extraLabels}
                    disableColLabels={disableColLabels}
                    disableRowLabels={disableRowLabels}
                />
            </DialogContent>
        </Dialog>
    );
}
