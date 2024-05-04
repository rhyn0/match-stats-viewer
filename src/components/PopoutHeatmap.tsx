import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { RangeHeatMap } from "./graphs/RangeHeatmap";
import { DataT } from "@/types";
import { Button } from "./ui/button";

export interface DialogHeatmapProps {
    data: DataT[];
    title: string;
    description: string;
    minMax?: [number, number];
}
export function DialogHeatmap({
    data,
    title,
    description,
    minMax,
}: DialogHeatmapProps) {
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
                />
            </DialogContent>
        </Dialog>
    );
}
