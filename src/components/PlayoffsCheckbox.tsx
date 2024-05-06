import {
    Head2HeadCheckboxRoles,
    Head2HeadCheckboxRolesT,
    Head2HeadChecklistResult,
    PlayoffChecklistStep,
} from "@/types";
import { Checkbox } from "./ui/checkbox";
import { Label } from "./ui/label";
import React from "react";
export interface PlayoffsCheckboxProps {
    steps: PlayoffChecklistStep[];
    checkedSteps: Head2HeadChecklistResult[];
    leftTeamName: string | undefined;
    rightTeamName: string | undefined;
}
export function PlayoffsCheckbox({
    steps,
    checkedSteps,
    leftTeamName,
    rightTeamName,
}: PlayoffsCheckboxProps) {
    if (steps.length !== checkedSteps.length) {
        console.error("Checked states are not aligning with provided steps");
    }
    const checkedLeftName = leftTeamName ?? "Not Selected";
    const checkedRightName = rightTeamName ?? "Not Selected";
    const groups = Head2HeadCheckboxRoles.map((role) => ({
        role,
        label:
            role === "left"
                ? checkedLeftName
                : role === "right"
                  ? checkedRightName
                  : "Tied",
    }));
    return (
        <div>
            <h2 className="mb-4 text-center text-lg">
                Check in Tied means no result. Winner of head to head is team
                with the first check in their column.
            </h2>
            <div className="mx-auto flex flex-row justify-center">
                {groups.map((group) => (
                    <div
                        key={`${group.role}-${group.label}`}
                        className="flex w-1/4 flex-col space-y-4"
                    >
                        <h3 className="text-lg">{group.label}</h3>
                        <div>
                            {steps.map((step, idx) => (
                                <LabeledCheckbox
                                    key={step.name}
                                    id={step.name}
                                    label={step.name}
                                    description={step.description}
                                    role={group.role}
                                    checked={checkedSteps[idx]}
                                />
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

interface LabeledCheckboxProps {
    /**
     * Description text to display
     */
    label: string;
    id: string;
    /**
     * Extra small text to further explain
     */
    description?: string;
    checked: Head2HeadChecklistResult;
    role: Head2HeadCheckboxRolesT;
}
function LabeledCheckbox({
    label,
    id,
    description,
    checked,
    role,
}: LabeledCheckboxProps) {
    const isOurRole = React.useCallback(
        (checkedValue: Head2HeadChecklistResult) => checkedValue === role,
        [role],
    );
    return (
        <div className="items-top flex space-x-2">
            <Checkbox
                id={id}
                disabled
                checked={isOurRole(checked)}
                className="pointer-events-none"
            />
            <div className="grid gap-1.5 leading-none">
                <Label
                    htmlFor={id}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                    {label}
                </Label>
                {description ? (
                    <p className="text-sm text-muted-foreground">
                        {description}
                    </p>
                ) : null}
            </div>
        </div>
    );
}
