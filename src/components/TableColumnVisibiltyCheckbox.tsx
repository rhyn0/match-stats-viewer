import { Checkbox } from "./ui/checkbox";
import { Label } from "./ui/label";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";

export function ColumnVisibiltyCheckbox({
    columnState,
    onChange,
}: {
    columnState: Record<string, boolean>;
    // eslint-disable-next-line no-unused-vars
    onChange: (colId: string, checked: boolean | string) => void;
}) {
    return (
        <Collapsible className="mx-auto flex flex-col">
            <CollapsibleTrigger>Toggle Columns</CollapsibleTrigger>
            <CollapsibleContent>
                <div className="grid grid-flow-row grid-cols-4 gap-2 border-2 border-foreground p-2">
                    {Object.entries(columnState).map(([name, visible]) => (
                        <div key={name}>
                            <Checkbox
                                id={name}
                                checked={visible}
                                onCheckedChange={(checked) =>
                                    onChange(name, checked)
                                }
                            />
                            <Label htmlFor={name}>{name}</Label>
                        </div>
                    ))}
                </div>
            </CollapsibleContent>
        </Collapsible>
    );
}
