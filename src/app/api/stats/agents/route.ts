import { NextResponse } from "next/server";
import db from "@/lib/drizzleLibSQL";

const exampleAgentData = {
    rows: [
        {
            id: 1,
            agent_name: "Astra",
            agent_type: "controller",
            mapsPlayed: 1,
            totalKills: 10,
            totalDeaths: 2,
            totalAssists: 5,
        },
    ],
    length: 1,
};

export async function GET(): Promise<NextResponse> {
    const agentResult = await db.query.agents.findMany();
    console.table(agentResult);

    return new NextResponse(JSON.stringify(exampleAgentData));
}
