import { TeamIdentifiers } from "@/types";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";

export interface HeadToHead2WaySelectorProps {
    teamIds: TeamIdentifiers[];
    onSubmit: React.Dispatch<HeadToHead2WayForm>;
}

export const HeadToHead2WayFormZ = z
    .object({
        teamAId: z.coerce.number(),
        teamBId: z.coerce.number(),
    })
    .refine((data) => data.teamAId !== data.teamBId, {
        message: "Head to head between the same team is not possible.",
        path: ["teamAId"],
    });

export type HeadToHead2WayForm = z.infer<typeof HeadToHead2WayFormZ>;

export function HeadToHead2WaySelector({
    teamIds,
    onSubmit,
}: HeadToHead2WaySelectorProps) {
    const form = useForm<HeadToHead2WayForm>({
        resolver: zodResolver(HeadToHead2WayFormZ),
    });

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit, console.error)}
                className="space-y-2"
            >
                <div className="flex w-full flex-row justify-evenly">
                    <FormField
                        control={form.control}
                        name="teamAId"
                        render={({ field }) => (
                            <FormItem className="w-1/3">
                                <FormLabel>Team A Name</FormLabel>
                                <FormControl>
                                    <TeamSelect
                                        teamIds={teamIds}
                                        onChange={field.onChange}
                                        defaultValue={field.value?.toString()}
                                    />
                                </FormControl>
                                <FormDescription>
                                    First team for head to head choice.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="teamBId"
                        render={({ field }) => (
                            <FormItem className="w-1/3">
                                <FormLabel>Team B Name</FormLabel>
                                <FormControl>
                                    <TeamSelect
                                        teamIds={teamIds}
                                        onChange={field.onChange}
                                        defaultValue={field.value?.toString()}
                                    />
                                </FormControl>
                                <FormDescription>
                                    Second team for head to head choice.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <Button
                    type="submit"
                    className="mx-auto flex justify-center"
                >
                    Submit
                </Button>
            </form>
        </Form>
    );
}

type TeamSelectProps = Omit<
    React.ComponentProps<typeof Select>,
    "onValueChange"
> & {
    teamIds: TeamIdentifiers[];
    onChange: React.Dispatch<string>;
};

function TeamSelect({ teamIds, onChange, defaultValue }: TeamSelectProps) {
    return (
        <Select
            onValueChange={onChange}
            defaultValue={defaultValue}
        >
            <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Team Name" />
            </SelectTrigger>
            <SelectContent>
                {teamIds.map(({ teamId, teamName }) => (
                    <SelectItem
                        key={teamId}
                        value={teamId.toString()}
                    >
                        {teamName}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}
